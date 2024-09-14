import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteTask } from '../redux/taskSlice';
import { Button, List, Modal, Input, Select, Card } from 'antd';
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';

const { Option } = Select;

const formatDate = (dueDate) => {
  const date = new Date(dueDate);
  return !isNaN(date) ? date.toISOString().split('T')[0] : 'No Due Date';
};

const TaskList = ({ onEdit }) => {
  const tasks = useSelector((state) => state.tasks.tasks);
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortOption, setSortOption] = useState('dueDate');

  const showDeleteConfirm = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this task?',
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'No, Cancel',
      onOk() {
        dispatch(deleteTask(id));
      },
    });
  };

  const filteredTasks = tasks
    .filter((task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((task) => (statusFilter === 'All' ? true : task.status === statusFilter))
    .sort((a, b) => {
      if (sortOption === 'dueDate') {
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      if (sortOption === 'priority') {
        const priorityOrder = { Low: 1, Medium: 2, High: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return 0;
    });

  return (
    <div className="p-4">
      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Search tasks"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-1/3"
        />
        <Select
          defaultValue="All"
          onChange={(value) => setStatusFilter(value)}
          className="w-1/3"
        >
          <Option value="All">All Statuses</Option>
          <Option value="In Progress">In Progress</Option>
          <Option value="Completed">Completed</Option>
        </Select>
        <Select
          defaultValue="dueDate"
          onChange={(value) => setSortOption(value)}
          className="w-1/3"
        >
          <Option value="dueDate">Sort by Due Date</Option>
          <Option value="priority">Sort by Priority</Option>
        </Select>
      </div>

      
      <List
        grid={{ gutter: 16, column: 1 }} 
        dataSource={filteredTasks}
        renderItem={(task) => (
          <List.Item>
            <Card
              title={task.title}
              extra={
                <div className=''>
                  <Button
                    type="primary"
                    icon={<AiOutlineEdit />}
                    onClick={() => onEdit(task)}
                    className="mr-2"
                  >
                    
                  </Button>
                  <Button
                    danger
                    icon={<AiOutlineDelete />}
                    onClick={() => showDeleteConfirm(task.id)}
                  >
                    
                  </Button>
                </div>
              }
              className="shadow-md rounded-lg"
            >
              <p>{task.description}</p>
              <p><strong>Due Date:</strong> {formatDate(task.dueDate)}</p>
              <p><strong>Priority:</strong> {task.priority}</p>
              <p className={task.status === 'Completed' ? 'text-green-600' : 'text-yellow-600'}>
                <strong>Status:</strong> {task.status}
              </p>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default TaskList;
