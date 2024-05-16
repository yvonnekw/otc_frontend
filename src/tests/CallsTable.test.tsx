import { render, screen } from "@testing-library/react";
import CallsTable from "../components/calls/CallsTable";
import React from "react";


import { BrowserRouter as Router } from 'react-router-dom';

describe("CallsTable component", () => {
    const testUserId = "yodalpinky1";
    it("should render correctly within a Router", () => {
        // Define testUserId
      

        render(
            <Router>
                <CallsTable userId={testUserId} />
            </Router>
        );

        // Use appropriate query methods to select elements within CallsTable
        const callsTableElement = screen.getByTestId('calls-table');

        // Assert the presence of CallsTable and any expected behavior or attributes
        expect(callsTableElement).toBeInTheDocument();
        // Add more assertions as needed
    });

    it("Page should not contain more than 1 second level heading (<h2> element)", () => {
        render(
            <Router>
                <CallsTable userId={testUserId} />
            </Router>
        );
        const secondLevelHeadings = screen.queryAllByRole("heading", { level: 2 });
        expect(secondLevelHeadings.length).toBe(0);

    })


});
