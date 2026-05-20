// Web3 to connect with the blockchain, and metamask to interact with the blockchain through the browser

App = {
  loading: false,
  contracts: {},

  load: async () => {
    await App.loadWeb3()
    await App.loadAccount()
    await App.loadContract()
    await App.render()
  },

  // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
loadWeb3: async () => {
  if (typeof window.ethereum !== 'undefined') {
    App.web3Provider = window.ethereum
    window.web3 = new Web3(window.ethereum)
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' })
    } catch (error) {
      console.error("User denied account access")
    }
  } else {
    window.alert("Please install MetaMask!")
  }
},

loadAccount: async () => {
  const accounts = await window.ethereum.request({ method: 'eth_accounts' })
  App.account = accounts[0]
},


  loadContract: async () => {
    // Create a JavaScript version of the smart contract
    const todoList = await $.getJSON('TodoList.json')
    App.contracts.TodoList = TruffleContract(todoList)
    App.contracts.TodoList.setProvider(App.web3Provider)

    // Hydrate the smart contract with values from the blockchain
    App.todoList = await App.contracts.TodoList.deployed()
  },

  render: async () => {
    // Prevent double render
    if (App.loading) {
      return
    }

    // Update app loading state
    App.setLoading(true)

    // Render Account
    $('#account').html(App.account)

    // Render Tasks
    await App.renderTasks()

    // Update loading state
    App.setLoading(false)
  },

  renderTasks: async () => {
    // Load the total task count from the blockchain
    const taskCount = await App.todoList.taskCount()
    const $taskTemplate = $('.taskTemplate')

    // Render out each task with a new task template
    for (var i = 1; i <= taskCount; i++) {
      // Fetch the task data from the blockchain
      const task = await App.todoList.tasks(i)
      const taskId = task[0].toNumber()
      const taskContent = task[1]
      const taskCompleted = task[2]
      const taskDueDate = task[3].toNumber()
      const taskCategory = task[4]

      // Create the html for the task
      const $newTaskTemplate = $taskTemplate.clone()
      $newTaskTemplate.find('.content').html(taskContent)
      $newTaskTemplate.find('input')
                      .prop('name', taskId)
                      .prop('checked', taskCompleted)
                      .on('click', App.toggleCompleted)

      // Put the task in the correct list
      if (taskCompleted) {
        $('#completedTaskList').append($newTaskTemplate)
      } else {
        $('#taskList').append($newTaskTemplate)
      }

      // Show the task
      $newTaskTemplate.show()
    }
  },

createTask: async () => {
  try {
    App.setLoading(true)

    const content = $('#newTask').val()
    const dueDateInput = $('#newDueDate').val()
    const category = $('#newCategory').val()

    
    if (!dueDateInput) {
      alert("Select due date")
      return
    }


    let dueDate = 0

    if (dueDateInput) {
      dueDate = Math.floor(new Date(dueDateInput).getTime() / 1000)
    }

    console.log({
      content,
      dueDate,
      category,
      types: [typeof content, typeof dueDate, typeof category]
    })

    await App.todoList.createTask(
      content,
      dueDate.toString(),
      category,
      { from: App.account }
    )

    window.location.reload()

  } catch (error) {
    console.error(error)
    alert("Transaction failed — check console")
  }
},
  toggleCompleted: async (e) => {
    App.setLoading(true)
    const taskId = e.target.name
    await App.todoList.toggleCompleted(taskId, { from: App.account })
    window.location.reload()
  },

  setLoading: (boolean) => {
    App.loading = boolean
    const loader = $('#loader')
    const content = $('#content')
    if (boolean) {
      loader.show()
      content.hide()
    } else {
      loader.hide()
      content.show()
    }
  }
}

$(() => {
  $(window).load(() => {
    App.load()
  })
})
