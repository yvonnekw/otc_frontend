import { render, screen } from "@testing-library/react";
import React from "react";
import matchers from "@testing-library/jest-dom/matchers";
import { expect } from "vitest"
import Home from "../components/home/Home"


import { BrowserRouter as Router } from 'react-router-dom';


describe("", () => {
    it.only("should verify the home welcome message is headed 1", () => {
        render(
            <Router>
                <Home />
            </Router>
        );
        expect(screen.getByRole('heading', { level: 1, })
        ).toHaveTextContent('Welcome to Optical Telephone Company')
        
    });


});
