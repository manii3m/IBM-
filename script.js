class Calculator {
    constructor() {
        this.currentValue = '0';
        this.previousValue = '';
        this.operator = null;
        this.waitingForOperand = false;
        
        this.currentDisplay = document.getElementById('currentDisplay');
        this.previousDisplay = document.getElementById('previousDisplay');
        
        this.initializeEventListeners();
    }
    
    initializeEventListeners() {
        // Button click events
        document.querySelectorAll('.btn-number').forEach(button => {
            button.addEventListener('click', () => {
                const number = button.dataset.number;
                if (number !== undefined) {
                    this.inputDigit(number);
                } else if (button.dataset.action === 'decimal') {
                    this.inputDecimal();
                }
            });
        });
        
        document.querySelectorAll('.btn-operator').forEach(button => {
            button.addEventListener('click', () => {
                const action = button.dataset.action;
                this.handleOperator(action);
            });
        });
        
        document.querySelectorAll('.btn-function').forEach(button => {
            button.addEventListener('click', () => {
                const action = button.dataset.action;
                this.handleFunction(action);
            });
        });
        
        // Keyboard support
        document.addEventListener('keydown', (e) => {
            this.handleKeyboard(e);
        });
    }
    
    inputDigit(digit) {
        if (this.waitingForOperand) {
            this.currentValue = String(digit);
            this.waitingForOperand = false;
        } else {
            this.currentValue = this.currentValue === '0' 
                ? String(digit) 
                : this.currentValue + digit;
        }
        this.updateDisplay();
    }
    
    inputDecimal() {
        if (this.waitingForOperand) {
            this.currentValue = '0.';
            this.waitingForOperand = false;
        } else if (this.currentValue.indexOf('.') === -1) {
            this.currentValue += '.';
        }
        this.updateDisplay();
    }
    
    handleOperator(action) {
        const inputValue = parseFloat(this.currentValue);
        
        if (action === 'equals') {
            if (this.operator && !this.waitingForOperand) {
                const result = this.calculate(
                    parseFloat(this.previousValue),
                    inputValue,
                    this.operator
                );
                
                this.currentValue = String(result);
                this.previousValue = '';
                this.operator = null;
                this.waitingForOperand = false;
            }
        } else {
            if (this.previousValue === '') {
                this.previousValue = this.currentValue;
            } else if (this.operator && !this.waitingForOperand) {
                const result = this.calculate(
                    parseFloat(this.previousValue),
                    inputValue,
                    this.operator
                );
                
                this.currentValue = String(result);
                this.previousValue = String(result);
            }
            
            this.waitingForOperand = true;
            this.operator = action;
        }
        
        this.updateDisplay();
    }
    
    handleFunction(action) {
        switch(action) {
            case 'clear':
                this.clear();
                break;
            case 'toggle-sign':
                this.toggleSign();
                break;
            case 'percent':
                this.percent();
                break;
        }
        this.updateDisplay();
    }
    
    calculate(firstOperand, secondOperand, operator) {
        let result;
        
        switch(operator) {
            case 'add':
                result = firstOperand + secondOperand;
                break;
            case 'subtract':
                result = firstOperand - secondOperand;
                break;
            case 'multiply':
                result = firstOperand * secondOperand;
                break;
            case 'divide':
                if (secondOperand === 0) {
                    alert('Cannot divide by zero!');
                    return 0;
                }
                result = firstOperand / secondOperand;
                break;
            default:
                return secondOperand;
        }
        
        // Round to avoid floating point errors
        return Math.round(result * 100000000) / 100000000;
    }
    
    clear() {
        this.currentValue = '0';
        this.previousValue = '';
        this.operator = null;
        this.waitingForOperand = false;
    }
    
    toggleSign() {
        this.currentValue = String(parseFloat(this.currentValue) * -1);
    }
    
    percent() {
        this.currentValue = String(parseFloat(this.currentValue) / 100);
    }
    
    updateDisplay() {
        // Format current value for display
        let displayValue = this.currentValue;
        
        // Limit display length
        if (displayValue.length > 12) {
            const num = parseFloat(displayValue);
            if (Math.abs(num) >= 1e12 || (Math.abs(num) < 1e-6 && num !== 0)) {
                displayValue = num.toExponential(6);
            } else {
                displayValue = displayValue.substring(0, 12);
            }
        }
        
        this.currentDisplay.textContent = displayValue;
        
        // Update previous display with operator
        if (this.previousValue && this.operator) {
            const operatorSymbols = {
                'add': '+',
                'subtract': '−',
                'multiply': '×',
                'divide': '÷'
            };
            this.previousDisplay.textContent = 
                `${this.previousValue} ${operatorSymbols[this.operator]}`;
        } else {
            this.previousDisplay.textContent = '';
        }
    }
    
    handleKeyboard(e) {
        // Prevent default for calculator keys
        if (e.key >= '0' && e.key <= '9' || 
            ['+', '-', '*', '/', 'Enter', 'Escape', '.', 'Backspace', '%'].includes(e.key)) {
            e.preventDefault();
        }
        
        // Number keys
        if (e.key >= '0' && e.key <= '9') {
            this.inputDigit(e.key);
        }
        
        // Decimal point
        if (e.key === '.') {
            this.inputDecimal();
        }
        
        // Operators
        if (e.key === '+') {
            this.handleOperator('add');
        }
        if (e.key === '-') {
            this.handleOperator('subtract');
        }
        if (e.key === '*') {
            this.handleOperator('multiply');
        }
        if (e.key === '/') {
            this.handleOperator('divide');
        }
        
        // Equals
        if (e.key === 'Enter' || e.key === '=') {
            this.handleOperator('equals');
        }
        
        // Clear
        if (e.key === 'Escape') {
            this.clear();
            this.updateDisplay();
        }
        
        // Backspace
        if (e.key === 'Backspace') {
            if (this.currentValue.length > 1) {
                this.currentValue = this.currentValue.slice(0, -1);
            } else {
                this.currentValue = '0';
            }
            this.updateDisplay();
        }
        
        // Percent
        if (e.key === '%') {
            this.percent();
        }
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});

// Made with Bob
