"use client";

import { useState } from "react";

export default function OperatorList() {
  const [operators] = useState([
    {
      name: "Demo Travels",
      email: "ops@demo.com",
      password: "temp123",
    },
  ]);

  return (
    <div className="card p-4 shadow-none border-0">
      <h5 className="mb-3">All Operators</h5>

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Password</th>
          </tr>
        </thead>
        <tbody>
          {operators.map((op, i) => (
            <tr key={i}>
              <td>{op.name}</td>
              <td>{op.email}</td>
              <td>{op.password}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}