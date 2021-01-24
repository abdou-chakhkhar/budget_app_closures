//Budget Controller
const budgetController = (function(){

    const Expenses = function(id, description, value){

        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;

        // const calcPercentage = function(totalIncome){
        //     if(totalIncome > 0){
        //         this.percentage = Math.round((this.value / totalIncome) * 100);
        //     }else{
        //         this.percentage = -1;
        //     }
        // };
        
        // const getPercentage = function(){
        //     return this.percentage;
        // };
    };

    Expenses.prototype.calcPercentage = function(totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };
    Expenses.prototype.getPercentage = function() {
        return this.percentage;
    };
    

    const Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };


    const calculateTotal = function(type){
        let sum = 0;
        
        data.allItems[type].forEach( cur => {
            sum += cur.value;
        });
        
        data.totals[type] = parseFloat(sum);
    };
    
    const data = {
        allItems:{
            exp: [],
            inc: []
        },
        totals:{
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };
    

    


    return{
        addItem: function(type, des, val){
            let newItem, ID;

            // create new ID
                if(data.allItems[type].length > 0){
                    ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
                }else{
                    ID = 0;
                }
                
            

            // create new item based on the value sign
            if(type === 'inc'){
                newItem = new Income(ID, des, val);
            }else{
                newItem = new Expenses(ID, des, val);
            }

            // push it into our data structure
            data.allItems[type].push(newItem);
            
            //return the new element
            return newItem;

        },
        calculateBudget: function(){
            // calculate total income and expenses
            calculateTotal('inc');
            calculateTotal('exp');

            // calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;
            
            //calculate the percentage  of income that we have spent
            if(data.totals.inc > 0){
                data.percentage = Math.round(( data.totals.exp / data.totals.inc) * 100);
            }else{
                data.percentage = -1;
            }  
        },
        calculatePercentages: function(){
            data.allItems.exp.forEach( cur => {
                cur.calcPercentage(data.totals.inc);
            }); 
        },
        getPercentages: function(){
            let allPerc = data.allItems.exp.map( cur => {
                return cur.getPercentage();
            });
            return allPerc;
        },
        getBudget: function(){
            return{
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },
        deleteItem: function(ID, type){

            let ids , index;
            ids = data.allItems[type].map( curr => {
                return curr.id;
            });
            index = ids.indexOf(ID);
            if(index !== -1){
                data.allItems[type].splice(index, 1);
            }
            
        },
        testing: function(){
            console.log(data);  
        }

    };


})();



// UI controller
const UIController = (function(){

    const DOMstrings = {
        inputType: '.add_type',
        inputDescription: '.add_description',
        inputValue: '.add_value',
        inputBtn: '.add_btn',
        incomeContainer: '.income_list',
        expensesContainer: '.expenses_list',
        listsContainer: '.lists',
        budgetLabel: '.budget_value',
        incomeLabel: '.budget_income-value',
        expensesLabel: '.budget_expenses-value',
        percentageLabel: '.budget_expenses-percentage',
        expensesPercLabel: '.item_percentage',
        dateLabel: '.budget_title-month',
        item: '.item'
    };

    const formatNumber = function(num, type){
        
        let numSplit, int;

        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');

        int = numSplit[0];

        if(int != 0){
            let fraction = '';
            //123

            for(let i = 1; i <= int.length ; i++){
                if(i%3 == 0){
                    if( (int.length - i) != 0){
                        fraction = ',' + int[int.length - i] + fraction; 
                    }else{
                        fraction = int[int.length - i] + fraction; 
                    }
                }else{
                    fraction = int[int.length - i] + fraction; 
                }
            }
            int = fraction;
        }

        

        // if(int.length > 3){
        //     int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        // }

        dec = numSplit[1];

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
    };

    const nodeListForEach = function(list, callback){
        for(let i = 0 ; i < list.length ; i++){
            callback(list[i], i);
        }
    };


    return{
        getInput: function(){
            return{
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },
        getDOMstrings: function(){
            return DOMstrings;
        },
        addListItem: function(obj, type){
            
            let html, element;

            if(type === 'inc'){
                element = DOMstrings.incomeContainer;
                html = `
                    <div id="inc-${obj.id}" class="item inc clearfix col-12 col-sm-12 col-md-12 col-lg-12">
                    <div class="item_description float-left">${obj.description}</div>
                    <div class="float-right">
                        <div class="item_value float-left">${formatNumber(obj.value, type)}</div>
                        <div class="item_delete float-left">
                            <button class="item_delete-btn">
                                <i class="ion-ios-close-outline"></i>
                            </button>
                        </div>
                    </div>
                    </div>
            `;
            }else{
                element = DOMstrings.expensesContainer;
                html = `
                    <div id="exp-${obj.id}" class="item exp clearfix col-12 col-sm-12 col-md-12 col-lg-12">
                    <div class="item_description float-left">${obj.description}</div>
                    <div class="float-right">
                        <div class="item_value float-left">${formatNumber(obj.value, type)}</div>
                        <div class="item_percentage float-left">${obj.percentage}</div>
                        <div class="item_delete float-left">
                            <button class="item_delete-btn">
                                <i class="ion-ios-close-outline"></i>
                            </button>
                        </div>
                    </div>
                    </div>
                `;
            }

            document.querySelector(element).insertAdjacentHTML('beforeend', html);
                       
        },
        displayBudget: function(obj){
            let type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');

            if(obj.percentage > 0){
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage +"%";
            }else{
                document.querySelector(DOMstrings.percentageLabel).textContent = "---";
            }
            
        },
        displayPercentages: function(percentages){

            let fields = document.querySelectorAll(DOMstrings.expensesPercLabel);
             nodeListForEach(fields, function(current, index){
                    if(percentages[index] > 0){
                        current.textContent = percentages[index] + '%';
                    }else{
                        current.textContent = '---';
                    }
             });

        },
        clearFields: function(){

            // document.querySelector(DOMstrings.inputDescription).value = '';
            // document.querySelector(DOMstrings.inputValue).value = '';
            // document.querySelector(DOMstrings.inputDescription).focus();

            let fields, fieldsArr;
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
            fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach( (current, index, array) => {
                current.value = "";
            });

            // fieldsArr[0].focus();
            document.querySelector(DOMstrings.inputType).focus();
        },
        displayMonth: function(){

            let now, months, month, year;

            now = new Date();

            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

            month = now.getMonth();
            year = now.getFullYear();

            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
            
        },
        changedType: function(){

            let fields = document.querySelectorAll(DOMstrings.inputType + ',' + DOMstrings.inputDescription + ',' + DOMstrings.inputValue);
            
            nodeListForEach(fields, function(cur){
                cur.classList.toggle("red-focus");
            });

            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');

        },
        removeItemFromList: function(selectorID){
            let element = document.getElementById(selectorID);
            element.parentNode.removeChild(element);
        }
    };


})();

// GLOBAL app controller
const controller = (function(budgetCtrl, UICtrl){

    const setupEventListeners = function(){

        const DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function(event){
            if(event.keyCode === 13 || event.which === 13){
                ctrlAddItem();
            }
        });
        document.querySelector(DOM.listsContainer).addEventListener('click', ctrlDeleteItem);
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
    };

    const updateBudget = function(){
        // 1. calculate the budget
        budgetCtrl.calculateBudget();

        // 2. return the budget
        const budget = budgetCtrl.getBudget();
        
        // 3. Display the budget on the UI
        UICtrl.displayBudget(budget);
        
    };

    const ctrlAddItem = function(){
            
        let input, newItem;

        // 1. get the field input data
        input = UICtrl.getInput();
        
        // 2. add the item to the budget controller
        if(input.description !== "" && !isNaN(input.value) && input.value > 0){
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        }

        // 3. add the item to the UI
        UICtrl.addListItem(newItem, input.type);

        // 4. clear the fields
        UICtrl.clearFields();

        // 5. calculate and update budget
        updateBudget();

        // 6. calculate and update percentages
        updatePercentages();

    };

    const ctrlDeleteItem = function(event){
        let itemID,splitID, type, ID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        splitID = itemID.split('-');
        ID = parseInt(splitID[1]);
        type = splitID[0]; // or the nest ligne
        // type = event.target.parentNode.parentNode.parentNode.parentNode.parentNode.id;
       
        if(itemID){
            // 1. delete the item from data structure
            budgetCtrl.deleteItem(ID, type);
            
            // 2. delete the item from the UI
            UICtrl.removeItemFromList(itemID);

            // 3. update and show the new budget
            updateBudget();

            // 4. calculate and update percentages
            updatePercentages();
        }


    };

    const updatePercentages = function(){
        
        // 1. calculate percentages
        budgetCtrl.calculatePercentages();

        // 2. Read percentages from the budget controller
        let percentages = budgetCtrl.getPercentages();
        
        // 3. Update the UI with the new percentages
        UICtrl.displayPercentages(percentages);

    };
    

    
    return{
        init:function(){
            console.log('Application has started.');
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
            
        }
    };



})(budgetController, UIController);


controller.init();