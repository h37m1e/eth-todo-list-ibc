pragma solidity ^0.5.0;

contract TodoList {
  uint public taskCount = 0;

  struct Task {
    uint id;
    string content;
    bool completed;
    uint dueDate;
    string category;
  }

  mapping(uint => Task) public tasks;

  event TaskCreated(
    uint id,
    string content,
    bool completed,
    uint dueDate,
    string category
  );

  event TaskCompleted(
    uint id,
    bool completed
  );

  constructor() public {
    createTask("Check out dappuniversity.com", 0, "Other");
  }

  function createTask(
    string memory _content,
    uint _dueDate,
    string memory _category
  ) public {
    taskCount++;

    tasks[taskCount] = Task(
      taskCount,
      _content,
      false,
      _dueDate,
      _category
    );

    emit TaskCreated(
      taskCount,
      _content,
      false,
      _dueDate,
      _category
    );
  }

  function toggleCompleted(uint _id) public {
    Task memory _task = tasks[_id];
    _task.completed = !_task.completed;
    tasks[_id] = _task;

    emit TaskCompleted(_id, _task.completed);
  }
}