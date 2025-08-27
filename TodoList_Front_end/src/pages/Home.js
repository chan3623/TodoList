import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Modal from '../components/Modal';
import '../assets/styles/Home.css';

const Home = () => {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editingText, setEditingText] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    const user = useSelector(state => state.user);

    // 현재 날짜 가져오기
    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const date = ('0' + today.getDate()).slice(-2);
    const day = today.toLocaleString('default', { weekday: 'short' });

    // 투두리스트를 서버에서 가져오는 함수
    const getTodos = async () => {
        try {
            const response = await fetch('http://15.164.226.28:4000/todo/dayList/select', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'user_email': user.user.user_email, 
                    'year_data': year, 
                    'mon_data': month, 
                    'day_data': date
                }),
            });
            if (!response.ok) {
                throw new Error('투두리스트 가져오기에 실패했습니다.');
            }
            const data = await response.json();
            const todoList = data.todoList.map(todo => ({
                id: todo.list_num,
                text: todo.todo,
                isChecked: todo.status
            }));
            setTodos(todoList.reverse());
        } catch (error) {
            // console.error('투두리스트 가져오기 오류:', error.message);
        }
    };

    // 컴포넌트가 처음 렌더링될 때 투두리스트를 가져옴
    useEffect(() => {
        getTodos();
    }, [year, month, date]);

    // 투두리스트를 추가
    const addTodo = async (e) => {
        e.preventDefault();
        if (!user.user) {
            setErrorMessage('로그인이 필요합니다.');
            setShowModal(true);
            return;
        }
        if (newTodo.trim()) {
            try {
                const response = await fetch('http://15.164.226.28:4000/todo/dayList/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        'user_email': user.user.user_email,
                        'year_data': year, 
                        'mon_data': month, 
                        'day_data': date, 
                        'todo': newTodo
                    }),
                });
                if (!response.ok) {
                    throw new Error('할 일 등록에 실패했습니다.');
                }
                const data = await response.json();
                if (data) {
                    setErrorMessage('리스트가 추가되었습니다.');
                    setShowModal(true);
                    setNewTodo('');
                } else {
                    console.log('할 일 등록 실패');
                }
            } catch (error) {
                console.error('할 일 등록 오류 :', error.message);
            }
        } else {
            setErrorMessage('할 일을 입력해주세요.');
            setShowModal(true);
        }
    };

    // 투두리스트 삭제
    const deleteTodo = async (id) => {
        const todoToDelete = todos.find(todo => todo.id === id); 
        if (!todoToDelete) return;
    
        try {
            const response = await fetch('http://15.164.226.28:4000/todo/dayList/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'list_num': todoToDelete.id,
                    'user_email': user.user.user_email,
                    'year_data': year,
                    'mon_data': month,
                    'day_data': date,
                    'todo': todoToDelete.text
                }),
            });
            if (!response.ok) {
                throw new Error('할 일 삭제에 실패했습니다.');
            }
            const data = await response.json();
            if (data) {
                setErrorMessage('리스트가 삭제되었습니다.');
                setShowModal(true);
                setTodos(todos.filter(todo => todo.id !== id));
            } else {
                console.log('할 일 삭제 실패');
            }
        } catch (error) {
            console.error('할 일 삭제 오류 :', error.message);
        }
    };
    
    const editTodo = (id) => {
        const todoToEdit = todos.find(todo => todo.id === id);
        if (todoToEdit) {
            setEditingId(id);
            setEditingText(todoToEdit.text);
        }
    };
    
    // 투두리스트 수정 저장
    const saveEdit = async (id) => {
        const todoToDelete = todos.find(todo => todo.id === id);
        if (!todoToDelete) return;
        if (editingText.trim()) { // 수정하려는 내용이 있는지 확인
            try {
                const response = await fetch('http://15.164.226.28:4000/todo/dayList/update', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        'list_num': todoToDelete.id,
                        'user_email': user.user.user_email,
                        'year_data': year,
                        'mon_data': month,
                        'day_data': date,
                        'todo': editingText
                    }),
                });
                if (!response.ok) {
                    throw new Error('할 일 수정에 실패했습니다.');
                }
                const data = await response.json();
                if (data) {
                    setErrorMessage('리스트가 수정되었습니다.');
                    setShowModal(true);
                    setTodos(todos.map(todo => todo.id === id ? { ...todo, text: editingText } : todo));
                    setEditingId(null);
                    // setEditingText('');
                } else {
                    console.log('할 일 수정 실패');
                }
            } catch (error) {
                console.error('할 일 수정 오류 :', error.message);
            }
        } else {
            setErrorMessage('할 일을 입력해주세요.');
            setShowModal(true);
        }
    };
    
    const handleCheckboxChange = async(id, currentStatus) => {
        const newStatus = !currentStatus;
        try {
            const response = await fetch('http://15.164.226.28:4000/todo/dayList/checkUpdate', {
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
                setTodos(todos.map(todo =>
                    todo.id === id ? { ...todo, isChecked: newStatus } : todo
                ));
            } else {
                console.log('할 일 상태 업데이트 실패');
            }
        } catch (error) {
            console.error('할 일 상태 업데이트 오류 :', error.message);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        getTodos();
        if (errorMessage === '로그인이 필요합니다.') {
            navigate('/login');
        }
    };
    

    return(
        <main className="App-home App-main">
            <section className="day-section App-section">
                <h3 className="today">{year}년 {month}월 {date}일 {day}요일</h3>
                <button type="button" className="sort-btn"></button>
            </section>
            <section className="list-section App-section">
                <div className="add-todo">
                    <button type="button" className="add-btn" onClick={addTodo}></button>
                    <div className="add-list-input-box">
                        <input 
                            type="text" 
                            maxLength="20"
                            className="add-list-input"
                            placeholder="할 일 등록"
                            value={newTodo} 
                            onChange={(e) => setNewTodo(e.target.value)} 
                        />
                        <div className="add-list-input-line"></div>
                    </div>
                </div>
                <div className="todo-list">
                    <ul className="todo-ul">
                        {todos.map(todo => (
                            <li className="todo-li" key={todo.id}>
                                {editingId === todo.id ? (
                                    <>
                                        <input
                                            type="checkbox"
                                            checked={todo.isChecked}
                                            className="list-check"
                                            id={`check-${todo.id}`}
                                            value={todo.id}
                                            onChange={() => handleCheckboxChange(todo.id, todo.isChecked)}
                                        />
                                        <label htmlFor={`check-${todo.id}`} className="list-check-label"></label>
                                        <div className="todo-content">
                                            <input className="edit-list-input"
                                                type="text"
                                                value={editingText}
                                                onChange={(e) => setEditingText(e.target.value)}
                                            />
                                            <button 
                                                type="button" 
                                                className="save-btn"
                                                onClick={() => saveEdit(todo.id)}
                                            ></button>
                                            <button 
                                                type="button" 
                                                className="delete-btn" 
                                                onClick={() => deleteTodo(todo.id)}
                                            ></button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <input
                                            type="checkbox"
                                            checked={todo.isChecked}
                                            className="list-check"
                                            id={`check-${todo.id}`}
                                            value={todo.id}
                                            onChange={() => handleCheckboxChange(todo.id, todo.isChecked)}
                                        />
                                        <label htmlFor={`check-${todo.id}`} className="list-check-label"></label>
                                        <div className="todo-content">
                                            <p className="todo-text">{todo.text}</p>
                                            <button 
                                                type="button" 
                                                className="edit-btn"
                                                onClick={() => editTodo(todo.id)}
                                            ></button>
                                            <button 
                                                type="button" 
                                                className="delete-btn" 
                                                onClick={() => deleteTodo(todo.id)}
                                            ></button>
                                        </div>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
            {showModal && (
                <Modal message={errorMessage} onClose={closeModal} />
            )}
        </main>
    )
}

export default Home;
