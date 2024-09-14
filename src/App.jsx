import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'antd';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import { useDispatch, useSelector } from 'react-redux';
import { setTasks } from './redux/taskSlice';
import { AiOutlinePlus } from 'react-icons/ai';
import './index.css'
const App = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.tasks);

  useEffect(() => {
    const storedTasks = sessionStorage.getItem('tasks');
    if (storedTasks) {
      dispatch(setTasks(JSON.parse(storedTasks)));
    }
  }, [dispatch]);

  useEffect(() => {
    if (tasks.length > 0) {
      sessionStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  const handleAddTask = () => {
    setSelectedTask(null);
    setIsModalVisible(true);
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedTask(null);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold">Task Manager</h1>
        <Button
          type="primary"
          icon={<AiOutlinePlus />}
          onClick={handleAddTask}
        >
          Add Task
        </Button>
      </div>

      <TaskList onEdit={handleEditTask} />

      <Modal
        title={selectedTask ? 'Edit Task' : 'Add New Task'}
        visible={isModalVisible}
        footer={null}
        onCancel={handleCloseModal}
      >
        <TaskForm
          existingTask={selectedTask}
          onComplete={handleCloseModal}
        />
      </Modal>
    </div>
  );
};

export default App;
