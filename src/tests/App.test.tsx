import { render, screen } from "@testing-library/react";
import  App from "../App"
import React from "react";
import { MemoryRouter } from "react-router-dom";


    it("Renders not found if invalid path", () => {

        render(
            <MemoryRouter initialEntries={['/page']}>
                <App />
            </MemoryRouter>
        )

    })