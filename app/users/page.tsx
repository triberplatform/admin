import React from "react";
import Header from "../components/Header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/Table";
import { DeleteIcon, Pen, Trash, Trash2 } from "lucide-react";
import Link from "next/link";

export default function page() {
  return (
    <div className="px-6">
      <Header />
      <div className="mt-5">
        <p className="font-semibold text-lg mb-5">Overview</p>
        <Table>
          <TableHead>
            <TableRow className="bg-gray-100">
              <TableHeader>First Name</TableHeader>
              <TableHeader>Last Name</TableHeader>
              <TableHeader>Email</TableHeader>
              <TableHeader>Company Name</TableHeader>
              <TableHeader>Location</TableHeader>
              <TableHeader>Date Joined</TableHeader>
              <TableHeader>Actions</TableHeader>
            </TableRow>
          </TableHead>

          <TableBody>
            {/* You can map through your data here */}
            <TableRow>
              <TableCell>Emeka</TableCell>
              <TableCell>Okechukwu</TableCell>
              <TableCell>email@test.com</TableCell>
              <TableCell>Emeka Company</TableCell>
              <TableCell>Lagos, Nigeria</TableCell>
              <TableCell>10 March 2025</TableCell>
              <TableCell>
                {" "}
                <div className="flex gap-3">
                  <Pen size={16} />{" "}
                  <Trash2 size={16} className="text-red-600" />{" "}
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Emeka</TableCell>
              <TableCell>Okechukwu</TableCell>
              <TableCell>email@test.com</TableCell>
              <TableCell>Emeka Company</TableCell>
              <TableCell>Lagos, Nigeria</TableCell>
              <TableCell>10 March 2025</TableCell>
              <TableCell>
                {" "}
                <div className="flex gap-3">
                  <Pen size={16} />{" "}
                  <Trash2 size={16} className="text-red-600" />{" "}
                </div>
              </TableCell>
            </TableRow>
            <TableRow link="/users/details">
              <TableCell>Emeka</TableCell>
              <TableCell>Okechukwu</TableCell>
              <TableCell>email@test.com</TableCell>
              <TableCell>Emeka Company</TableCell>
              <TableCell>Lagos, Nigeria</TableCell>
              <TableCell>10 March 2025</TableCell>
              <TableCell>
                {" "}
                <div className="flex gap-3">
                  <Pen size={16} />{" "}
                  <Trash2 size={16} className="text-red-600" />{" "}
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Emeka</TableCell>
              <TableCell>Okechukwu</TableCell>
              <TableCell>email@test.com</TableCell>
              <TableCell>Emeka Company</TableCell>
              <TableCell>Lagos, Nigeria</TableCell>
              <TableCell>10 March 2025</TableCell>
              <TableCell>
                {" "}
                <div className="flex gap-3">
                  <Pen size={16} />{" "}
                  <Trash2 size={16} className="text-red-600" />{" "}
                </div>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Emeka</TableCell>
              <TableCell>Okechukwu</TableCell>
              <TableCell>email@test.com</TableCell>
              <TableCell>Emeka Company</TableCell>
              <TableCell>Lagos, Nigeria</TableCell>
              <TableCell>10 March 2025</TableCell>
              <TableCell>
                {" "}
                <div className="flex gap-3">
                  <Link href={"/users/details"}>
                    <Pen size={16} />
                  </Link>
                  <Trash2 size={16} className="text-red-600" />{" "}
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
