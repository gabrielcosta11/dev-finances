//Abre e fecha o modal
const Modal = {
    //Abre o modal
    open() {
        document
            .querySelector('.modal-overlay')
            .classList
            .add('active')
    },
    
    close() {
        //Fecha o modal
        document
            .querySelector('.modal-overlay')
            .classList
            .remove('active')
    }
}

const Storage = {
    get() {
        return JSON.parse(localStorage.getItem('allTransactions')) || []
    },

    set(obj) {
        localStorage.setItem('allTransactions', JSON.stringify(obj))
    }
}

//Armazena as transações em um objeto
let list = Storage.get()

//Pega os valores do input e guarda no objeto
function Transaction(id, description, amount, date) {
    this.id = id
    this.description = description
    this.amount = amount
    this.date = date
}
const getData = {
    save() {
        let description = document.getElementById('description').value
        let amount = document.getElementById('amount').value
        let date = document.getElementById('date').value
        let id = Number(list.length) + 1
        list.push(new Transaction(id, description, amount, date))

        console.log(list)
    }

}

//Formata os dados
const DataFormat = {
    dateFormat(date) {
        console.log(date)
        let date1 = date
        date1 += 'T00:00:00'
        let dateF = new Date(date1)
        dateF = dateF.toLocaleDateString("pt-BR")
        return dateF
    },

    currencyFormat(amount) {
        let currency = Number(amount).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
        return currency
    },

    getFormat(obj) {
        let allFormat = []
        for(let index in obj) {
            let transaction = Object.assign({}, obj[index])
            console.log(transaction)
            transaction.date = DataFormat.dateFormat(transaction.date)
            transaction.amount = DataFormat.currencyFormat(transaction.amount)
            allFormat.push(transaction)
        }
        return allFormat
    }
}

//Adiciona e Remove o conteúdo ao HTML
const DOM = {
    addTransaction() {
        getData.save()
        DOM.balance.balance()
        Modal.close()

        App.reload(list, 'add')
        Storage.set(list)
    },

    addAllTransaction() {
        let index = document.getElementById('tbody')
        let allTransactions = DataFormat.getFormat(list)
        console.log(allTransactions, 'ALLTRANSACTIONS')
        for(let i in allTransactions) {
            let tr = document.createElement('tr')
            tr.innerHTML = DOM.toHtml(allTransactions[i])
            index.appendChild(tr)
        }
    },
    
    toHtml(transaction) {
        let type
        let amount = list[Number(transaction.id) - 1].amount
        if(amount > 0) {
            type = 'incomes'
        } else {
            type = 'expenses'
        }
        let html = `
            <td>${transaction.description}</td>
            <td class="${type}">${transaction.amount}</td>
            <td>${transaction.date}</td>
            <td>
                <button id="${transaction.id}" onclick="DOM.remove(this.id)">
                    <img src="assets/minus.svg" alt="">
                </button>
            </td>
        `
        return html
    },

    balance: {
        balance() {
            let incomes = document.getElementsByClassName("value-card")[0]
            let expenses = document.getElementsByClassName("value-card")[1]
            let total = document.getElementsByClassName("value-card")[2]
            let values = DOM.balance.sum(list)
            incomes.innerHTML = DataFormat.currencyFormat(values[0])
            expenses.innerHTML = DataFormat.currencyFormat(values[1])
            total.innerHTML = DataFormat.currencyFormat(values[2])
        },

        sum(obj) {//Faz as contas do balanço
            let incomes = 0
            let expenses = 0
            let total = 0
            for(let i in obj) {
                let number = Number(obj[i].amount)
                if(number > 0) {
                    incomes += number
                }
                else {
                    expenses += number
                }
            }
            total = incomes + expenses
            let values = [incomes, expenses, total]
            return values
        }
    },

    remove(index) {
        let el = document.getElementById(index)
        el = el.parentNode
        el = el.parentNode
        el.parentNode.removeChild(el)
        
        for(let i in list) {
            if(list[i].id == index) {
                list.splice(i, 1)
            }
        }
        DOM.balance.balance()
        console.log(list, 'REMOVE')
        
        App.reload(list, 'remove')
        Storage.set(list)
    }
}

const App = {
    appInit() {
        Storage.set(list)
        console.log(list, 'RELOAD')
        DOM.balance.balance()
        App.reload(list, 'add')
    },

    reload(obj, type) {
        let historic = document.getElementById('tbody')
        if(type == 'add') {
            historic.innerHTML = ''
            for(i in obj) {
                obj[i].id = Number(i) + 1
            }
            DOM.addAllTransaction()
        }
        

        if(type == "remove") {
            for(i in obj) {
                obj[i].id = Number(i) + 1
            }
            let c = 0
            for (let child of historic.children) {
                c++
                let button =  child.lastElementChild
                button = button.children[0]
                button.setAttribute('id', `${c}`)
            }
        }
    }
}

//Formulário
const Form = {
    description: document.getElementById('description'),
    amount: document.getElementById('amount'),
    date: document.getElementById('date'),
    validateFields() {
        let description = Form.description.value
        let amount = Form.amount.value
        let date = Form.date.value
        if(description.trim() === "" ||
            amount.trim() === "" ||
            date.trim() === ""
        ) {
            throw new Error('Por favor, preencha todos os campos')
        }
    },

    clearFields() {
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },
    
    submit(event) {
        event.preventDefault()

        try {
            Form.validateFields()
            Form.clearFields()
        } catch (error) {
            alert(error.message)
            DOM.remove(list[list.length - 1].id)
            Modal.open()
        }
    },
}
