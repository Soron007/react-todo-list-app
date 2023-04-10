import React, { useState, useEffect } from 'react';
import { AiFillDelete } from 'react-icons/ai'
import { MdModeEditOutline } from 'react-icons/md';
import { TiTick } from 'react-icons/ti'
import { FaUndoAlt } from 'react-icons/fa'

export const Todolist = () => {
    const [input, setInput] = useState('');
    const [editInput, setEditInput] = useState('');
    const [todos, setTodos] = useState([]);
    const [search, setSearch] = useState('');
    const [itemsDeleted, setItemsDeleted] = useState(0);
    const [editingIndex, setEditingIndex] = useState(-1);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        if (localStorage.getItem('todos') === null) {
            localStorage.setItem("todos", JSON.stringify([]))
        } else {
            let todoLocal = JSON.parse(localStorage.getItem("todos"));
            setTodos(todoLocal);
        }

    }, []);

    useEffect(() => {

        if (todos.length > 0) {
            localStorage.setItem('todos', JSON.stringify(todos));
        }

    }, [todos]);


    useEffect(() => {
        setInterval(() => {
            setCurrentTime(new Date())
        }, 1000)


    }, [])


    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim()) {
            setTodos([...todos, { title: input, completed: false }]);
        }
        setInput('');
    };

    const handleDelete = (index) => {
        const deleted = todos.filter((_, i) => i !== index)
        setItemsDeleted((prev) => prev + 1)
        setTodos(deleted)
    }

    const searchedTodos = todos.filter((todo) => {

        return (todo.title.toLowerCase().includes(search.toLowerCase()))


    })

    const toggleCompletedTodo = (index) => {
        const updatedTodos = todos.map((todo, i) => {
            return (index === i ? { ...todo, completed: !todo.completed } : todo)
        })

        setTodos(updatedTodos);
    }

    const handleEdit = (index) => {
        setEditingIndex(index);
        setEditInput(todos[index].title);
    };

    const handleSave = (index) => {
        const updatedTodos = [...todos];

        if (editInput) {
            updatedTodos[index].title = editInput;
            setTodos(updatedTodos);
            setEditingIndex(-1);
            setEditInput('');
        }

    };




    return (
        <>

            <h1 className='font-bold text-2xl mb-2 uppercase text-black text-center sm:text-lg md:text-xl lg:text-2xl'>Todo-List app</h1>
            <div className='p-4 shadow-2xl rounded-lg h-[80vh] w-full md:max-w-md sm:w-full lg:max-w-lg'>
                <div className="shadow-lg text-black bg-gradient-to-r from-white to-blue-200 inline-block p-2 rounded-lg" >
                    <span>{currentTime.toLocaleTimeString()}</span>
                </div>
                <form className='flex justify-between items-center w-full relative mt-3' onSubmit={handleSubmit}>
                    <input type='text' className='flex-1 rounded-lg p-2 text-xl text-blue-700 outline-none border-none mr-2 font-bold' value={input} onChange={(e) => setInput(e.target.value)} />
                    <button className='bg-white text-black  hover:text-black absolute right-5 '>
                        <span className='text-2xl'>+</span>
                    </button>
                </form>

                <span className='mt-2 font-bold text-xs sm:text-xl md:text-lg lg:text-lg'>Number of items: {todos.length} </span> |
                <span className='mt-2 font-bold text-xs ml-1 sm:text-xl md:text-lg lg:text-lg'>Items deleted: {itemsDeleted} </span>

                <div className='mb-2 mt-2 w-full flex justify-between items-center'>


                    <input type="text" className="outline-none rounded-lg text-bold text-blue-700 p-1 placeholder:italic placeholder:text-slate-700" placeholder='Search Todo... ' name='search' value={search} onChange={(e) => setSearch(e.target.value)} />

                </div>

                <ul className='mt-3 p-2 overflow-y-auto max-h-[65vh]'>
                    {searchedTodos.map((todo, index) => (
                        <li key={index} className='flex justify-between items-center p-3 border-2 rounded-lg border-white w-full shadow-xl bg-transparent cursor-pointer hover:bg-slate-200 mt-2'>
                            {editingIndex === index ? (
                                <form onSubmit={(e) => { e.preventDefault(); handleSave(index) }}>
                                    <input type="text" className="flex-1 rounded-lg p-2 text-xl text-blue-700 outline-none border-none mr-2 font-bold" value={editInput} onChange={(e) => setEditInput(e.target.value)} />
                                    <button className='mt-2 bg-blue-700 text-white px-4 py-2 rounded-md font-bold hover:bg-blue-600'>Save</button>
                                </form>
                            ) : (
                                <>
                                    <span className={`text-lg overflow-x-auto font-bold ${todo.completed ? 'line-through text-gray-400' : 'text-blue-700'}`}>{todo.title}</span>
                                    <div className='flex'>
                                        <button className='mx-2' onClick={() => toggleCompletedTodo(index)}>{todo.completed ? <FaUndoAlt /> : <TiTick className='h-6 w-6' />}</button>
                                        <button className='mx-2' onClick={() => handleEdit(index)}><MdModeEditOutline /></button>
                                        <button className='mx-2' onClick={() => handleDelete(index)}><AiFillDelete /></button>
                                    </div>
                                </>
                            )}
                        </li>

                    ))}
                </ul>
            </div >
        </>
    );
};
