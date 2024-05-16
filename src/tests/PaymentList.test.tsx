import { render, screen } from "@testing-library/react";
import  PaymentList  from "../components/payment/PaymentList"
import React from "react";


import { BrowserRouter as Router } from 'react-router-dom';


describe("", () => {
    it("should verify the home welcome message is heading 1", () => {
        render(
            <Router>
                <PaymentList />
            </Router>
        );
        expect(screen.getByRole('heading', { level: 1, })
        ).toHaveTextContent('Welcome to Optical Telephone Company')
        
    });

    it("Page should not contain more than 1 second level heading (<h2> element)", () => {
        render(
            <Router>
                <PaymentList />
            </Router>
        );
        const secondLevelHeadings = screen.queryAllByRole("heading", { level: 2 });
        expect(secondLevelHeadings.length).toBe(0);

    })


});
