import React from 'react';

class ComponentToPrintRevenueDaily extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            date: new Date(),
        }
    }



    render() {
        return (
            <div className="row">
                Thích gì thì code ra revenue daily
            </div>
        );
    }
}

export default ComponentToPrintRevenueDaily;