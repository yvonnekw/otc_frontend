import { render, screen } from "@testing-library/react";
import  MakeCall  from "../components/calls/MakeCall"
import React from "react";


import { BrowserRouter as Router } from 'react-router-dom';


describe("", () => {
    it("should verify the home welcome message is heading 1", () => {
        render(
            <Router>
                <MakeCall />
            </Router>
        );
        expect(screen.getByRole('heading', { level: 1, })
        ).toHaveTextContent('Welcome to Optical Telephone Company')
        
    });

    it("Page should not contain a second level heading (<h2> element)", () => {
        render(
            <Router>
                <MakeCall />
            </Router>
        );
        const secondLevelHeadings = screen.queryAllByRole("heading", { level: 2 });
        expect(secondLevelHeadings.length).toBe(0);

    })

    it("form label should correctly associate with a form control.", () => {
        render(
            <Router>
                <MakeCall />
            </Router>
        );
       
        const formLabel = screen.getByText('Your Form Label Text');

        const formControl = screen.getByLabelText('Your Form Label Text');

        expect(formLabel).toBe(formControl.id);

    });

    it("should ensure all form labels are correctly associated with their form controls", () => {

        const formLabels = screen.getAllByRole('formlabel');

        formLabels.forEach(formLabel => {
            const formControlId = formLabel.getAttribute('aria-labelledby');
            const formControl = screen.getAllByLabelText("form - label"); 
            expect(formControl).toBeTruthy();
        });
    });

    it("should ensure all form controls has a corresponding label", () => {

        const formControls = screen.getAllByRole('textbox', { name: /form - control/i }); // Assuming form controls have "form - control" in their label text

        formControls.forEach(formControl => {
            const formControlId = formControl.getAttribute('aria-labelledby');
            const associatedLabel = screen.getAllByLabelText("form - label");

            expect(associatedLabel).toBeTruthy();
        });
    });

    it("should ensure all form controls has a corresponding label", () => {

        const formControls = screen.getAllByRole('textbox', { name: /form - control/i }); // Assuming form controls have "form - control" in their label text

        formControls.forEach(formControl => {
            const formControlId = formControl.getAttribute('aria-labelledby');
            const associatedLabel = screen.getAllByLabelText("form - label");

            expect(associatedLabel).toBeTruthy();
        });
    });

});
