import { render, screen } from "@testing-library/react"
import  UserList  from "../components/users/UserList"
import React from "react";

import { expect } from "vitest";

describe('User List Page tests',() =>{
it("should verify the User List text", () => {
    render(<UserList />)

    const message = screen.queryByText(/User List/)
    expect(message).toBeVisible
    
});

});