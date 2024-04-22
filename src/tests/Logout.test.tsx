import { render, screen } from "@testing-library/react";
import  Logout  from "../components/auth/Logout"
import React from "react";


import { BrowserRouter as Router } from 'react-router-dom';


describe("", () => {

    it("Page must have a level-one heading", () => {
        render(
            <Router>
                <Logout />
            </Router>
        );
        const secondLevelHeadings = screen.queryAllByRole("heading", { level: 1 });
        expect(secondLevelHeadings.length).toBe(0);


    })


});
