import React, { useState, useEffect } from 'react';
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import moment from "moment";
import { useSelector } from 'react-redux';
import TodoModal from './TodoModal';
import '../assets/styles/Calendar.css';

const CalendarPage = () => {
    const [value, setValue] = useState(new Date());
    const [monthlyData, setMonthlyData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDateTodos, setSelectedDateTodos] = useState([]);
    const [modalTodos, setModalTodos] = useState([]);
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedDate, setSelectedDate] = useState('');

    const user = useSelector(state => state.user);

    const year = moment(value).format('YYYY');
    const month = moment(value).format('MM');
    const day = moment(value).format('DD');

    useEffect(() => {
        fetchMonthlyData();
    }, [year, month]);

    useEffect(() => {
        fetchDailyData();
    }, [year, month, day]);

    const fetchMonthlyData = async () => {
        try {
            const response = await fetch('http://15.164.226.28:4000/todo/dayList/month/select', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'user_email': user.user.user_email,
                    'year_data': year,
                    'mon_data': month
                }),
            });
            if (!response.ok) {
                throw new Error('투두리스트 가져오기에 실패했습니다.');
            }
            const data = await response.json();
            console.log('Monthly Data:', data);
            if (data.success) {
                setMonthlyData(data.todoMonthList.reverse());
            } else {
                throw new Error('투두리스트 가져오기에 실패했습니다.');
            }
        } catch (error) {
            console.error('투두리스트 가져오기 오류:', error.message);
        }
    };

    const fetchDailyData = async () => {
        try {
            const requestBody = JSON.stringify({
                'user_email': user.user.user_email,
                'year_data': year,
                'mon_data': month,
                'day_data': day
            });
    
            const response = await fetch('http://15.164.226.28:4000/todo/dayList/select', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: requestBody,
            });
    
            if (!response.ok) {
                throw new Error('투두리스트 가져오기에 실패했습니다.');
            }
    
            const data = await response.json();
            console.log('Daily Data:', data);
            if (data.success) {
                const sortedTodos = data.todoList.reverse();
                setSelectedDateTodos(sortedTodos);
                setModalTodos(sortedTodos);
            } else {
                throw new Error('투두리스트 가져오기에 실패했습니다.');
            }
        } catch (error) {
            console.error('투두리스트 가져오기 오류:', error.message);
        }
    };
    
    const pastelColors = [
        '#ffadad', '#ffd6a5', '#fdffb6', '#caffbf', '#9bf6ff', '#a0c4ff', '#bdb2ff', '#ffc6ff'
    ];

    const handleMarkerClick = (date) => {
        const selectedYear = moment(date).format('YYYY');
        const selectedMonth = moment(date).format('MM');
        const selectedDate = moment(date).format('DD');
        
        const selectedTodos = monthlyData.filter(item =>
            item.year_data === selectedYear &&
            item.mon_data === selectedMonth &&
            item.day_data === selectedDate
        );
    
        setSelectedDateTodos(selectedTodos);
        setModalTodos(selectedTodos);
    
        setSelectedYear(selectedYear);
        setSelectedMonth(selectedMonth);
        setSelectedDate(selectedDate);
    
        setIsModalOpen(true);
    };

    const getColorForDate = (date) => {
        const day = moment(date).date();
        return pastelColors[day % pastelColors.length];
    };
    
    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const day = moment(date).format('DD');
            const month = moment(date).format('MM');
            const year = moment(date).format('YYYY'); 
            const dayData = monthlyData.find(item =>
                item.year_data === year &&
                item.mon_data === month &&
                item.day_data === day
            );
            if (dayData) {
                const color = getColorForDate(date);
                return (
                    <div
                        className="todo-marker"
                        style={{ backgroundColor: color }}
                        onClick={() => handleMarkerClick(date)}
                    ></div>
                );
            } else {
                return (
                    <div
                        className="todo-marker"
                        onClick={() => handleMarkerClick(date)}
                    ></div>
                );
            }
        }
    };
    
    const closeModal = () => {
        setIsModalOpen(false);
        fetchMonthlyData();
    };

    return (
        <main className="App-calendar App-main">
            <Calendar
                calendarType="gregory"
                view="month"
                prev2Label={null}
                next2Label={null}
                showNeighboringMonth={false}
                value={value}
                onChange={setValue}
                tileContent={tileContent}
            />
            <TodoModal
                isOpen={isModalOpen}
                todos={modalTodos}
                onClose={closeModal}
                selectedYear={selectedYear}
                selectedMonth={selectedMonth}
                selectedDate={selectedDate}
                fetchDailyData={fetchDailyData}
            />
        </main>
    );
}

export default CalendarPage;

