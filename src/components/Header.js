import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <ul style={{ display: "flex", justifyContent: "space-between" }}>
      <li>
        <Link to="/">메인</Link>
      </li>
      <li>
        <Link to="/master">마스터</Link>
      </li>
      <li>
        <Link to="/subscribe">뷰어</Link>
      </li>
    </ul>
  );
}

export default Header;
