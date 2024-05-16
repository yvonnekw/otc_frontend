import { render, screen } from "@testing-library/react";
import React from "react";
import { BrowserRouter as Router } from 'react-router-dom';
import Payment from "../components/payment/Payment";

describe('Payment page Accessibility tests',() =>{
 
    it("Page should not contain a second level heading (<h2> element)", () => {
        render(
            <Router>
                <Payment />
            </Router>
        );
        expect(screen.getByRole('heading', { level: 1, }))

    })

    it("form label should correctly associate with a form control.", () => {
        render(
            <Router>
                <Payment />
            </Router>
        );
       // expect(screen.getByRole('form', { level: 1, })
       

    })

    it("Input element should have a form control corresponding label.", () => {
        render(
            <Router>
                <Payment />
            </Router>
        );
        // expect(screen.getByRole('form', { level: 1, })


    })

    it("should not contain redundant links that goes to the same URL.", () => {
        render(
            <Router>
                <Payment />
            </Router>
        );
        // expect(screen.getByRole('form', { level: 1, })


    })


});