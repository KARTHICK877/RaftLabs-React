import React, { useState, useEffect } from 'react';
import { Input, Button, DatePicker, Select, Form, Col, Row, Typography } from 'antd';
import { useDispatch } from 'react-redux';
import { addTask, updateTask } from '../redux/taskSlice';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment'; 
const { Option } = Select;
const { Title } = Typography;

const TaskForm = ({ existingTask, onComplete }) => {
  const dispatch = useDispatch();

  const [task, setTask] = useState({
    title: '',
    description: '',
    dueDate: null,
    priority: 'Low',
    status: 'In Progress',
  });

  useEffect(() => {
    if (existingTask) {
      setTask({
        title: existingTask.title,
        description: existingTask.description,
        dueDate: existingTask.dueDate ? moment(existingTask.dueDate) : null, // Use moment for date handling
        priority: existingTask.priority,
        status: existingTask.status,
      });
    } else {
      setTask({
        title: '',
        description: '',
        dueDate: null,
        priority: 'Low',
        status: 'In Progress',
      });
    }
  }, [existingTask]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };

  const handleDateChange = (date) => {
    setTask({ ...task, dueDate: date });
  };

  const handlePriorityChange = (value) => {
    setTask({ ...task, priority: value });
  };

  const handleStatusChange = (value) => {
    setTask({ ...task, status: value });
  };

  const handleSubmit = () => {
    if (existingTask) {
      
      dispatch(updateTask({ ...task, id: existingTask.id }));
    } else {
      
      dispatch(addTask({ ...task, id: uuidv4() }));
    }
    onComplete(); 
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <Title level={3} className="mb-4 text-center">
        {existingTask ? 'Edit Task' : 'Add Task'}
      </Title>
      <Form layout="vertical">
        <Form.Item label="Task Title" required>
          <Input
            name="title"
            value={task.title}
            onChange={handleInputChange}
            placeholder="Enter task title"
          />
        </Form.Item>
        <Form.Item label="Description">
          <Input.TextArea
            name="description"
            value={task.description}
            onChange={handleInputChange}
            placeholder="Enter task description"
            rows={4}
          />
        </Form.Item>
        <Form.Item label="Due Date">
          <DatePicker
            onChange={handleDateChange}
            value={task.dueDate}
            format="YYYY-MM-DD"
            style={{ width: '100%' }}
          />
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Priority">
              <Select
                value={task.priority}
                onChange={handlePriorityChange}
                placeholder="Select priority"
              >
                <Option value="Low">Low</Option>
                <Option value="Medium">Medium</Option>
                <Option value="High">High</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Status">
              <Select
                value={task.status}
                onChange={handleStatusChange}
                placeholder="Select status"
              >
                <Option value="In Progress">In Progress</Option>
                <Option value="Completed">Completed</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          <Button
            type="primary"
            onClick={handleSubmit}
            style={{ width: '100%' }}
          >
            {existingTask ? 'Update Task' : 'Add Task'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default TaskForm;
