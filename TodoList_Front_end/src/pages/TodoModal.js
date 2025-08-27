import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Modal from '../components/Modal';
import '../assets/styles/TodoModal.css';

const TodoModal = (props) => {
    const { isOpen, todos, onClose, selectedYear, selectedMonth, selectedDate, fetchDailyData } = props;

    const [newTodoText, setNewTodoText] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editingText, setEditingText] = useState('');
    const [todosState, setTodosState] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const user = useSelector(state => state.user);

    useEffect(() => {
        const updatedTodos = todos.map(todo => ({
            ...todo,
            isEditing: todo.isEditing || false,
            status: todo.status !== undefined ? todo.status : false,
            todo: todo.todo !== undefined ? todo.todo : ''
        }));
        setTodosState(updatedTodos);
    }, [todos]);

    const handleCheckboxChange = async (id, isChecked) => {
        const newStatus = !isChecked;
        try {
            const updatedTodos = todosState.map(todo =>
                todo.list_num === id ? { ...todo, status: !isChecked } : todo
            );
            setTodosState(updatedTodos);

            const response = await fetch(`http://15.164.226.28:4000/todo/dayList/checkUpdate`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'list_num': id,
                    'status': newStatus ? 1 : 0
                }),
            });

            if (!response.ok) {
                throw new Error('할 일 상태 업데이트에 실패했습니다.');
            }

            const data = await response.json();

            if (data) {
                console.log('할 일 상태 업데이트 성공');
                const updatedTodosAfterServerUpdate = todosState.map(todo =>
                    todo.list_num === id ? { ...todo, status: data.status } : todo
                );
                setTodosState(updatedTodosAfterServerUpdate);
                fetchDailyData();
            } else {
                console.log('할 일 상태 업데이트 실패');
            }
        } catch (error) {
            console.error('할 일 상태 업데이트 오류 :', error.message);
        }
    };


    const addTodo = async () => {
        try {
            if (!newTodoText.trim()) {
                setErrorMessage('할 일을 입력해주세요.');
                setShowModal(true);
                return;
            }
    
            const newTodo = {
                'user_email': user.user.user_email,
                'year_data': selectedYear,
                'mon_data': selectedMonth,
                'day_data': selectedDate,
                'todo': newTodoText
            };
    
            const response = await fetch('http://15.164.226.28:4000/todo/dayList/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newTodo),
            });
    
            if (!response.ok) {
                throw new Error('Failed to add todo');
            }
    
            const data = await response.json();
            if(data) {
                setErrorMessage(`${selectedMonth}월 ${selectedDate}일의 리스트가 추가되었습니다.`);
                setNewTodoText('');
                setTodosState(prevTodos => [data, ...prevTodos]);
                setShowModal(true);
                fetchDailyData();
            } else {
                console.log('리스트 추가 실패');
            }
        } catch (error) {
            console.error('Error adding todo:', error.message);
        }
    };
    

    const editTodo = (id) => {
        const updatedTodos = todosState.map(todo =>
            todo.list_num === id ? { ...todo, isEditing: true } : { ...todo, isEditing: false }
        );
        setTodosState(updatedTodos);
        setEditingId(id);
        const todoToEdit = todosState.find(todo => todo.list_num === id);
        if (todoToEdit) {
            setEditingText(todoToEdit.todo);
        }
    };

    const saveEdit = async (id, editedText) => {
        try {
            if (!editedText.trim()) {
                setErrorMessage('할 일을 입력해주세요.');
                setShowModal(true);
                return;
            }
    
            const updatedTodo = {
                'list_num': id,
                'user_email': user.user.user_email,
                'year_data': selectedYear,
                'mon_data': selectedMonth,
                'day_data': selectedDate,
                'todo': editedText
            };
    
            const response = await fetch(`http://15.164.226.28:4000/todo/dayList/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedTodo),
            });
    
            if (!response.ok) {
                throw new Error('Failed to save edit');
            }
    
            const data = await response.json();
            
            if(data.success) {
                setErrorMessage('리스트가 수정되었습니다.');
                setShowModal(true);
                const updatedTodos = todosState.map(todo =>
                    todo.list_num === id ? { ...todo, todo: editedText, isEditing: false } : todo
                );
                setTodosState(updatedTodos);
            }
        } catch (error) {
            console.error('Error saving edit:', error.message);
        }
    };
    

    const deleteTodo = async (id, todoText) => {
        try {
            const response = await fetch(`http://15.164.226.28:4000/todo/dayList/delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'list_num': id,
                    'user_email': user.user.user_email,
                    'year_data': selectedYear,
                    'mon_data': selectedMonth,
                    'day_data': selectedDate,
                    'todo': todoText
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to delete todo');
            }

            const data = await response.json();
            
            if(data.success) {
                setErrorMessage('리스트가 삭제되었습니다.');
                setShowModal(true);
                const updatedTodos = todosState.filter(todo => todo.list_num !== id);
                setTodosState(updatedTodos);
            }
        } catch (error) {
            console.error('Error deleting todo:', error.message);
        }
    };

    const handleNewTodoChange = (e) => {
        setNewTodoText(e.target.value);
    };

    const handleEditInputChange = (e) => {
        setEditingText(e.target.value);
    };

    if (!isOpen) {
        return null;
    }

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <div className="modal-close">
                    <button className="close-btn" onClick={onClose}></button>
                </div>
                <div className="add-todo">
                    <button type="button" className="add-btn" onClick={addTodo}></button>
                    <div className="add-list-input-box">
                        <input
                            type="text"
                            maxLength="20"
                            className="add-list-input"
                            placeholder="할 일 등록"
                            value={newTodoText}
                            onChange={handleNewTodoChange}
                        />
                        <div className="add-list-input-line"></div>
                    </div>
                </div>
                <ul className="modal-todo-ul">
                    {todosState.map((todo, index) => (
                        <li key={index} className="modal-todo-li">
                            {todo.isEditing ? (
                                <>
                                    <input
                                        type="checkbox"
                                        checked={todo.status}
                                        className="list-check"
                                        value={todo.status}
                                        id={`check-${todo.list_num}`}
                                        onChange={() => handleCheckboxChange(todo.list_num, todo.status)}
                                    />
                                    <label htmlFor={`check-${todo.list_num}`} className="list-check-label"></label>
                                    <div className="modal-todo-content">
                                        <input
                                            type="text"
                                            className="edit-list-input"
                                            value={editingText}
                                            onChange={handleEditInputChange}
                                        />
                                        <button
                                            type="button"
                                            className="save-btn"
                                            onClick={() => saveEdit(todo.list_num, editingText)}
                                        ></button>
                                        <button
                                            type="button"
                                            className="delete-btn"
                                            onClick={() => deleteTodo(todo.list_num, todo.todo)}
                                        ></button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <input
                                        type="checkbox"
                                        checked={todo.status}
                                        className="list-check"
                                        value={todo.status}
                                        id={`check-${todo.list_num}`}
                                        onChange={() => handleCheckboxChange(todo.list_num, todo.status)}
                                    />
                                    <label htmlFor={`check-${todo.list_num}`} className="list-check-label"></label>
                                    <div className="modal-todo-content">
                                        <p className="todo-text" onClick={() => editTodo(todo.list_num)}>{todo.todo}</p>
                                        <button
                                            type="button"
                                            className="edit-btn"
                                            onClick={() => editTodo(todo.list_num)}
                                        ></button>
                                        <button
                                            type="button"
                                            className="delete-btn"
                                            onClick={() => deleteTodo(todo.list_num, todo.todo)}
                                        ></button>
                                    </div>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
            {showModal && (
                <Modal message={errorMessage} onClose={closeModal} />
            )}
        </div>
    );
};

export default TodoModal;

