import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  Tag,
  Space,
  Input,
  Button,
  Select,
  Modal,
  Form,
  notification,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";

const { Search } = Input;
const { Option } = Select;

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://project-management-tool-backend-gayc.onrender.com/api/task/get-all-tasks",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
          },
        }
      );
      setTasks(response.data.tasks || []);
      setFilteredTasks(response.data.tasks || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    filterData({ searchTerm: value });
  };

  const filterData = ({ searchTerm, status, priority, role }) => {
    let filteredData = tasks.filter(
      (task) =>
        task.taskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.taskDescription.toLowerCase().includes(searchTerm.toLowerCase()) || 
        task.role.toLowerCase().includes(searchTerm.toLowerCase()) 

    );

    if (status) {
      filteredData = filteredData.filter((task) =>
        task.taskStatus.toLowerCase().includes(status.toLowerCase())
      );
    }

    if (priority) {
      filteredData = filteredData.filter((task) =>
        task.taskPriority.toLowerCase().includes(priority.toLowerCase())
      );
    }

    if (role) {
      filteredData = filteredData.filter((task) =>
        task.role.toLowerCase().includes(role.toLowerCase())
      );
    }

    setFilteredTasks(filteredData);
  };

  const handleEdit = (taskId) => {
    const task = tasks.find((t) => t._id === taskId);
    setCurrentTask(task);
    form.setFieldsValue({
      taskName: task.taskName,
      taskDescription: task.taskDescription,
      role: task.role,
      dueDate: task.taskDueDate, 
      status: task.taskStatus,
      priority: task.taskPriority,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (taskId) => {
    try {
      const token = localStorage.getItem("Token");
      await axios.delete(
        `https://project-management-tool-backend-gayc.onrender.com/api/task/delete-task/${taskId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTasks(tasks.filter((task) => task._id !== taskId));
      setFilteredTasks(filteredTasks.filter((task) => task._id !== taskId));
      notification.success({ message: "Task deleted successfully" });
    } catch (error) {
      console.error(`Error deleting task with id: ${taskId}`, error);
      notification.error({ message: "Error deleting task" });
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const updatedTask = {
        ...currentTask,
        taskName: values.taskName,
        taskDescription: values.taskDescription,
        role: values.role,
        taskDueDate: values.dueDate,
        taskStatus: values.status,
        taskPriority: values.priority,
      };

      const token = localStorage.getItem("Token");
      await axios.put(
        `https://project-management-tool-backend-gayc.onrender.com/api/task/edit-task/${currentTask._id}`,
        updatedTask,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTasks(
        tasks.map((task) => (task._id === currentTask._id ? updatedTask : task))
      );
      setFilteredTasks(
        filteredTasks.map((task) =>
          task._id === currentTask._id ? updatedTask : task
        )
      );
      setIsModalVisible(false);
      notification.success({ message: "Task updated successfully" });
    } catch (error) {
      console.error(`Error updating task:`, error);
      notification.error({ message: "Error updating task" });
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const columns = [
    {
      title: "Task Name",
      dataIndex: "taskName",
      key: "taskName",
      sorter: (a, b) => a.taskName.localeCompare(b.taskName),
    },
    {
      title: "Description",
      dataIndex: "taskDescription",
      key: "taskDescription",
      sorter: (a, b) => a.taskDescription.localeCompare(b.taskDescription),
    },
    {
      title: "Status",
      dataIndex: "taskStatus",
      key: "taskStatus",
      sorter: (a, b) => a.taskStatus.localeCompare(b.taskStatus),
      render: (status) => (
        <Tag color={status === "Active" ? "green" : "red"}>{status}</Tag>
      ),
      filters: [
        { text: "Active", value: "Active" },
        { text: "Closed", value: "Closed" },
      ],
      onFilter: (value, record) => record.taskStatus.indexOf(value) === 0,
    },
    {
      title: "Priority",
      dataIndex: "taskPriority",
      key: "taskPriority",
      sorter: (a, b) => a.taskPriority.localeCompare(b.taskPriority),
      render: (priority) => (
        <Tag
          color={
            priority === "High"
              ? "red"
              : priority === "Medium"
              ? "orange"
              : "green"
          }
        >
          {priority}
        </Tag>
      ),
      filters: [
        { text: "High", value: "High" },
        { text: "Medium", value: "Medium" },
        { text: "Low", value: "Low" },
      ],
      onFilter: (value, record) => record.taskPriority.indexOf(value) === 0,
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      sorter: (a, b) => a.role.localeCompare(b.role),
      filters: [
        { text: "Team Leader", value: "Team Leader" },
        { text: "Developer", value: "Developer" },
        { text: "Tester", value: "Tester" },
        { text: "Designer", value: "Designer" },
      ],
      onFilter: (value, record) => record.role.indexOf(value) === 0,
    },
    {
      title: "Created Date",
      dataIndex: "taskCreatedDate",
      key: "taskCreatedDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Due Date",
      dataIndex: "taskDueDate",
      key: "taskDueDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Assets",
      dataIndex: "assets",
      key: "assets",
      render: (assets) => (
        <div className="flex flex-wrap text-wrap overflow-auto">
          {Array.isArray(assets) ? (
            assets.map((asset, index) => (
              <a
                key={index}
                href={asset}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-300 hover:text-green-700 mr-2 mb-2 hover:scale-110"
              >
                Asset {index + 1}
              </a>
            ))
          ) : (
            <a
              href={assets}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-300 hover:text-green-700 mr-2 mb-2 hover:scale-110"
            >
              Asset Link
            </a>
          )}
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record._id)}
            className="bg-yellow-300  text-black hover:scale-125"
          ></Button>
          <Button
            type="danger"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id)}
            className="bg-red-500 hover:bg-red-600 text-white hover:scale-125"
          ></Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="w-full p-4 h-full overflow-hidden rounded-2xl shadow-xl mt-4">
      <div className="mb-4 flex justify-center">
        <Search
          placeholder="Search tasks"
          enterButton={<SearchOutlined />}
          size="large"
          onSearch={handleSearch}
          style={{ width: 400 }}
        />
      </div>

      <Table
        dataSource={filteredTasks}
        columns={columns}
        loading={loading}
        scroll={{ x: "100%" }}
        rowKey="_id"
      />

      <Modal
        title="Edit Task"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Update"
        cancelText="Cancel"
        width="50%"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="taskName"
            label="Task Name"
            rules={[{ required: true, message: "Task name is required" }]}
          >
            <Input placeholder="Enter task name" />
          </Form.Item>
          <Form.Item
            name="taskDescription"
            label="Description"
            rules={[{ required: true, message: "Description is required" }]}
          >
            <Input.TextArea placeholder="Enter task description" />
          </Form.Item>
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: "Role is required" }]}
          >
            <Select placeholder="Select role">
              <Option value="Team Leader">Team Leader</Option>
              <Option value="Developer">Developer</Option>
              <Option value="Tester">Tester</Option>
              <Option value="Designer">Designer</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="dueDate"
            label="Due Date"
            rules={[{ required: true, message: "Due date is required" }]}
          >
            <Input type="date" />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Status is required" }]}
          >
            <Select placeholder="Select status">
              <Option value="Active">Active</Option>
              <Option value="Closed">Closed</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="priority"
            label="Priority"
            rules={[{ required: true, message: "Priority is required" }]}
          >
            <Select placeholder="Select priority">
              <Option value="High">High</Option>
              <Option value="Medium">Medium</Option>
              <Option value="Low">Low</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TaskList;
