import { render, screen } from "@testing-library/react";
import  Home  from "../components/home/Home"
import React from "react";
//import { Router } from "react-router-dom";

import { BrowserRouter as Router } from 'react-router-dom';

it("should verify the home welcome message is heading 1", () => {
    render(
        <Router>
            <Home />
        </Router>
    );
    expect(screen.getByRole('heading', { level: 1, })
    ).toHaveTextContent('Welcome to Optical Telephone Company')
    
})