export function attachBehavior(target, win) {
    win.customElements.whenDefined('xtal-deco').then(() => {
        win.customElements.get('xtal-deco').attachBehavior(target, {
            on: {
                click: function (e) {
                    const ds = e.target.dataset;
                    if (ds.num) {
                        if (this.expectNewNumber) {
                            this.currentNum = ds.num;
                            this.expectNewNumber = false;
                        } else {
                            this.currentNum += ds.num;
                        }


                    } else if (ds.ops) {
                        this.lastOp = ds.ops;
                        this.lhsOperand = parseFloat(this.currentNum);
                        this.expectNewNumber = true;
                    } else {
                        switch (e.target.id) {
                            case 'equals':
                                const oldNum = this.currentNum;
                                this.currentNum = '';
                                switch (this.lastOp) {
                                    case 'plus':
                                        this.answerNum = this.lhsOperand + parseFloat(oldNum);
                                        break;
                                    case 'times':
                                        this.answerNum = this.lhsOperand * parseFloat(oldNum);
                                        break;
                                    case 'minus':
                                        this.answerNum = this.lhsOperand - parseFloat(oldNum);
                                        break;
                                    case 'divided by':
                                        this.answerNum = this.lhsOperand / parseFloat(oldNum);
                                }
                                this.lhsOperand = 0;
                                break;
                            case 'clear':
                                console.log('clear');
                                this.lhsOperand = 0;
                                this.answerNum = 0;
                                this.currentNum = '';
                                break;

                        }
                    }
                }
            },
            props: {
                lhsOperand: 0,
                expectNewNumber: false,
                currentNum: '',
                answerNum: 0,
                lastOp: '',
            }
        });
    })
}