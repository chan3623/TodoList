import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import Modal from '../components/Modal'
import '../assets/styles/Category.css';

const CategoryPage = () => {
    const [categories, setCategories] = useState([]);
    const [newCategoryTitle, setNewCategoryTitle] = useState('');
    const [expandedCategories, setExpandedCategories] = useState({});
    const [newListTitles, setNewListTitles] = useState([]);
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [editingCategoryTitle, setEditingCategoryTitle] = useState('');
    const [editingListItemId, setEditingListItemId] = useState(null);
    const [editingListItemText, setEditingListItemText] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const categoryRef = useRef(null);

    const user = useSelector(state => state.user);

    useEffect(() => {
        if (categoryRef.current) {
            scrollToCategory(categoryRef.current); // useEffect 내에서 스크롤 함수 호출
        }
    }, [expandedCategories]);

    const scrollToCategory = (element) => {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const handleInputChange = (event) => {
        setNewCategoryTitle(event.target.value);
    };

    const handleListInputChange = (event, index) => {
        const updatedListTitles = [...newListTitles];
        updatedListTitles[index] = event.target.value;
        setNewListTitles(updatedListTitles);
    };

    const handleEditListItem = (itemId, itemText) => {
        setEditingListItemId(itemId);
        setEditingListItemText(itemText);
    };

    const handleListItemInputChange = (event) => {
        setEditingListItemText(event.target.value);
    };

    const getTodos = async () => {
        try {
            const response = await fetch(`http://kkms4001.iptime.org:33042/todo/categoryList/${user.user.user_email}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (!response.ok) {
                throw new Error('투두리스트 가져오기에 실패했습니다.');
            }
            const data = await response.json();
            if (data.success) {
                const todoList = data.categoryList.map(todo => ({
                    id: todo.categoryList_num,
                    title: todo.category_name,
                    items: todo.categoryList_data || []
                }));
                setCategories(todoList.reverse());
                setNewListTitles(new Array(todoList.length).fill(''));
            }
        } catch (error) {
            console.error('투두리스트 가져오기 오류:', error.message);
        }
    };

    useEffect(() => {
        getTodos();
    }, []);

    const getTodoList = async (categoryId) => {
        try {
            const response = await fetch(`http://kkms4001.iptime.org:33042/todo/categoryData/${user.user.user_email}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (!response.ok) {
                throw new Error('투두리스트 가져오기에 실패했습니다.');
            }
            const data = await response.json();
            const categoryDataList = data.categoryDataList || [];
            if (data.success) {
                const updatedCategories = categories.map(category => {
                    if (category.id === categoryId) {
                        const filteredItems = categoryDataList
                            .filter(item => item.categoryList_num === category.id)
                            .map(item => ({
                                id: item.categoryData_num,
                                text: item.category_data,
                                isChecked: item.status === 1
                            }));
                        return {
                            ...category,
                            items: filteredItems.reverse()
                        };
                    }
                    return category;
                });
                setCategories(updatedCategories);
            }
        } catch (error) {
            console.error('투두리스트 가져오기 오류:', error.message);
        }
    };

    const addCategory = async () => {
        if (newCategoryTitle.trim() !== '') {
            const newCategory = {
                user_email: user.user.user_email,
                category_name: newCategoryTitle,
            };
            try {
                const response = await fetch('http://kkms4001.iptime.org:33042/todo/categoryList/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newCategory)
                });
    
                if (!response.ok) {
                    throw new Error('일치하는 정보 없음.');
                }
    
                const data = await response.json();
    
                if (data.success) {
                    setErrorMessage('리스트의 주제가 등록되었습니다.');
                    setShowModal(true);
                    setNewCategoryTitle('');
                    getTodos();
                } else {
                    console.log('리스트 주제 등록 실패');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        } else {
            setErrorMessage('리스트의 주제를 입력해주세요.');
            setShowModal(true);
        }
    };

    const updateCategoryTitle = async (id) => {
        if (editingCategoryTitle.trim() !== '') {
            const updatedCategory = {
                categoryList_num: id,
                category_ChangeName: editingCategoryTitle,
            };
            try {
                const response = await fetch('http://kkms4001.iptime.org:33042/todo/categoryList/update', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedCategory)
                });
    
                const data = await response.json();
    
                if (data.success) {
                    setErrorMessage('주제 제목이 수정되었습니다.');
                    setShowModal(true);
                    setEditingCategoryId(null);
                    setEditingCategoryTitle('');
                    getTodos();
                } else {
                    console.log('주제 제목 수정 실패');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        } else {
            setErrorMessage('수정할 주제를 입력해 주세요.');
            setShowModal(true);
        }
    };


    const deleteCategory = async (id) => {
        try {
            const response = await fetch('http://kkms4001.iptime.org:33042/todo/categoryList/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ categoryList_num: id })
            });
            if (!response.ok) {
                throw new Error('카테고리 삭제에 실패했습니다.');
            }
            const data = await response.json();
            if(data.success){
                setErrorMessage('주제가 삭제되었습니다.');
                setShowModal(true);
                setCategories(prevCategories => prevCategories.filter(category => category.id !== id));
                getTodos();
            }else {
                console.log('주제 삭제 실패');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const addListItem = async (categoryId, index) => {
        const title = newListTitles[index];
        const category = categories.find(cat => cat.id === categoryId);
        if (title && title.trim() !== '') {
            const newItem = {
                categoryList_num: categoryId,
                user_email: user.user.user_email,
                category_data: title,
            };
            try {
                const response = await fetch('http://kkms4001.iptime.org:33042/todo/categoryData/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newItem)
                });
                if (!response.ok) {
                    throw new Error('리스트 아이템 추가에 실패했습니다.');
                }
                const data = await response.json();
                if (data.success) {
                    setErrorMessage(`[ ${category.title} ] 의 리스트가 추가되었습니다.`);
                    setShowModal(true);
                    setNewListTitles(prev => {
                        const updatedListTitles = [...prev];
                        updatedListTitles[index] = '';
                        return updatedListTitles;
                    });
                    await getTodoList(categoryId);
                    setExpandedCategories(prevState => ({
                        ...prevState,
                        [categoryId]: true
                    }));
                }
            } catch (error) {
                console.error('Error:', error);
            }
        } else {
            setErrorMessage('할 일을 입력해주세요.');
            setShowModal(true);
        }
    };
    
    const updateListItem = async (categoryId, itemId) => {
        if (editingListItemText.trim() !== '') {
            const updatedItem = {
                categoryData_num: itemId,
                category_ChangeData: editingListItemText,
            };
            try {
                const response = await fetch(`http://kkms4001.iptime.org:33042/todo/categoryData/update`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedItem)
                });
    
                const data = await response.json();
    
                if (data.success) {
                    setErrorMessage('리스트가 수정되었습니다.');
                    setShowModal(true);
                    getTodoList(categoryId);
                    setEditingListItemId(null);
                    setEditingListItemText('');
                } else {
                    console.log('리스트 수정 실패');
                }
    
            } catch (error) {
                console.error('리스트 아이템 수정 오류:', error);
            }
        } else {
            setErrorMessage('할 일을 입력해주세요.');
            setShowModal(true);
        }
    };

    const deleteListItem = async (categoryId, itemId) => {
        try {
            const response = await fetch(`http://kkms4001.iptime.org:33042/todo/categoryData/delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ categoryData_num: itemId })
            });

            const data = await response.json();

            console.log(data);

            if(data.success) {
                setErrorMessage('리스트가 삭제되었습니다.');
                setShowModal(true);
                getTodoList(categoryId);
            }else {
                console.log('리스트 삭제 실패');
            }

        } catch (error) {
            console.error('리스트 아이템 삭제 오류:', error);
        }
    };

    const handleCheckboxChange = async (e, categoryId, itemId) => {
        const updatedCategories = categories.map(category => {
            if (category.id === categoryId) {
                const updatedItems = category.items.map(item => {
                    if (item.id === itemId) {
                        return {
                            ...item,
                            isChecked: e.target.checked
                        };
                    }
                    return item;
                });
                return {
                    ...category,
                    items: updatedItems
                };
            }
            return category;
        });
        setCategories(updatedCategories);
        try {
            const response = await fetch(`http://kkms4001.iptime.org:33042/todo/categoryData/checkUpdate`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    categoryData_num: itemId,
                    status: e.target.checked ? 1 : 0
                }),
            });
            if (!response.ok) {
                throw new Error('할 일 상태 업데이트에 실패했습니다.');
            }
            const data = await response.json();

            if (data.success) {
                console.log('할 일 상태 업데이트 성공');
            } else {
                console.log('할 일 상태 업데이트 실패');
            }

        } catch (error) {
            console.error('할 일 상태 업데이트 오류:', error.message);
        }
    };
    
    const toggleList = async (categoryId) => {
        if (!expandedCategories[categoryId]) {
            await getTodoList(categoryId);
        }
        setExpandedCategories(prevState => ({
            ...prevState,
            [categoryId]: !prevState[categoryId]
        }));
    };
    
    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <main className="App-category App-main">
            <section className="App-section category-section">
                <div className="add-category">
                    <button type="button" className="add-btn" onClick={addCategory}></button>
                    <div className="add-category-input-box">
                        <input
                            type="text"
                            className="add-category-input"
                            placeholder="주제 등록"
                            value={newCategoryTitle}
                            onChange={handleInputChange}
                        />
                        <div className="add-category-input-line"></div>
                    </div>
                </div>
                <ul className="category-ul">
                    {categories.map((category, index) => (
                        <li key={category.id} className="category-li"  ref={categoryRef}>
                            <div className="category-title-box">
                                {editingCategoryId === category.id ? (
                                    <>
                                        <input
                                            type="text"
                                            className="edit-category-input"
                                            value={editingCategoryTitle}
                                            onChange={(e) => setEditingCategoryTitle(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            className="save-btn"
                                            onClick={() => updateCategoryTitle(category.id)}
                                        ></button>
                                    </>
                                ) : (
                                    <>
                                        <div className="category-title">
                                            <h4 className="category-title-name">
                                                {category.title}
                                            </h4>
                                            <button
                                                className={`toggle-btn ${expandedCategories[category.id] ? 'expanded' : ''}`}
                                                onClick={() => toggleList(category.id)}
                                            ></button>
                                        </div>
                                        <button
                                            type="button"
                                            className="edit-btn"
                                            onClick={() => {
                                                setEditingCategoryId(category.id);
                                                setEditingCategoryTitle(category.title);
                                            }}
                                        ></button>
                                    </>
                                )}
                                <button
                                    type="button"
                                    className="delete-btn"
                                    onClick={() => deleteCategory(category.id)}
                                ></button>
                            </div>
                            <div className="add-category-list">
                                <button
                                    type="button"
                                    className="list-add-btn"
                                    onClick={() => addListItem(category.id, index)}
                                ></button>
                                <div className="add-category-list-input-box">
                                    <input
                                        className="add-category-list-input"
                                        type="text"
                                        placeholder="할 일 등록"
                                        value={newListTitles[index] || ''}
                                        onChange={(event) => handleListInputChange(event, index)}
                                    />
                                    <div className="add-category-list-input-line"></div>
                                </div>
                            </div>
                            {expandedCategories[category.id] && (
                                <ul className="category-data-ul">
                                    {category.items.map(item => (
                                        <li key={item.id} className="category-data-li">
                                            {editingListItemId === item.id ? (
                                                <>
                                                    <input
                                                        type="checkbox"
                                                        className="list-check"
                                                        id={`check-${item.id}`}
                                                        checked={item.isChecked}
                                                        onChange={(e) => handleCheckboxChange(e, category.id, item.id)}
                                                    />
                                                    <label htmlFor={`check-${item.id}`} className="list-check-label"></label>
                                                    <input
                                                        type="text"
                                                        className="edit-list-item-input"
                                                        value={editingListItemText}
                                                        onChange={handleListItemInputChange}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="save-btn"
                                                        onClick={() => updateListItem(category.id, item.id)}
                                                    ></button>
                                                    <button
                                                        type="button"
                                                        className="delete-btn"
                                                        onClick={() => deleteListItem(category.id, item.id)}
                                                    ></button>
                                                </>
                                            ) : (
                                                <>
                                                    <input
                                                        type="checkbox"
                                                        className="list-check"
                                                        id={`check-${item.id}`}
                                                        checked={item.isChecked}
                                                        onChange={(e) => handleCheckboxChange(e, category.id, item.id)}
                                                    />
                                                    <label htmlFor={`check-${item.id}`} className="list-check-label"></label>
                                                    <p className="list-item-text">{item.text}</p>
                                                    <button
                                                        type="button"
                                                        className="edit-btn"
                                                        onClick={() => handleEditListItem(item.id, item.text)}
                                                    ></button>
                                                    <button
                                                        type="button"
                                                        className="delete-btn"
                                                        onClick={() => deleteListItem(category.id, item.id)}
                                                    ></button>
                                                </>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            </section>
            {showModal && (
                <Modal message={errorMessage} onClose={closeModal} />
            )}
        </main>
    );
};

export default CategoryPage;
