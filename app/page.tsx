import {
  Briefcase,
  Check,
  Users,
  X,
} from "lucide-react";

import StatCard from "./components/CardStat";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/Table";
import CircularProgress from "./components/CircularProgress";
import Header from "./components/Header";

export default function Home() {
  return (
    <div className="px-6">
    <Header/>
      <div className="mt-5">
        <p className="font-semibold text-lg mb-5">Overview</p>
        <div className="grid grid-cols-3 gap-8">
          <StatCard
            title="Users"
            count={567}
            icon={Users}
            viewAllLink="/users"
            color="indigo-500"
          />

          <StatCard
            title="Businesses"
            count={903}
            icon={Briefcase}
            viewAllLink="/businesses"
            color="blue-500"
          />

          <StatCard
            title="Investors"
            count={214}
            icon={Briefcase}
            viewAllLink="/investors"
            color="purple-500"
          />
        </div>
      </div>
      <div className="mt-5 mb-10">
        <p className="font-semibold text-lg mb-5">Fundability Tests</p>
        <Table>
          <TableHead>
            <TableRow className="bg-gray-100">
              <TableHeader>User</TableHeader>
              <TableHeader>Business Name</TableHeader>
              <TableHeader>Type</TableHeader>
              <TableHeader>Email</TableHeader>
              <TableHeader>Documents</TableHeader>
              <TableHeader>Fundability Score</TableHeader>
              <TableHeader>Actions</TableHeader>
            </TableRow>
          </TableHead>

          <TableBody>
            {/* You can map through your data here */}
            <TableRow>
              <TableCell>Emeka Okechukwu</TableCell>
              <TableCell>Okechukwu Agro Ventures</TableCell>
              <TableCell>Startup</TableCell>
              <TableCell>emeka.okechukwu@email.com</TableCell>
              <TableCell>doc</TableCell>
              <TableCell>
                <CircularProgress percentage={70} />
              </TableCell>
              <TableCell>
                {" "}
                <div className="flex gap-3">
                  <div className="rounded-full border border-green-700 bg-green-700/20 w-5 h-5 flex items-center justify-center text-green-700">
                    <Check size={13} />{" "}
                  </div>
                  <div className="rounded-full border border-red-700 bg-red-700/20 w-5 h-5 flex items-center justify-center text-red-700">
                    <X size={13} />{" "}
                  </div>
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Emeka Okechukwu</TableCell>
              <TableCell>Okechukwu Agro Ventures</TableCell>
              <TableCell>Startup</TableCell>
              <TableCell>emeka.okechukwu@email.com</TableCell>
              <TableCell>doc</TableCell>
              <TableCell>
                <CircularProgress percentage={10} />
              </TableCell>
              <TableCell>
                {" "}
                <div className="flex gap-3">
                  <div className="rounded-full border border-green-700 bg-green-700/20 w-5 h-5 flex items-center justify-center text-green-700">
                    <Check size={13} />{" "}
                  </div>
                  <div className="rounded-full border border-red-700 bg-red-700/20 w-5 h-5 flex items-center justify-center text-red-700">
                    <X size={13} />{" "}
                  </div>
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Emeka Okechukwu</TableCell>
              <TableCell>Okechukwu Agro Ventures</TableCell>
              <TableCell>Startup</TableCell>
              <TableCell>emeka.okechukwu@email.com</TableCell>
              <TableCell>doc</TableCell>
              <TableCell>
                <CircularProgress percentage={50} />
              </TableCell>
              <TableCell>
                {" "}
                <div className="flex gap-3">
                  <div className="rounded-full border border-green-700 bg-green-700/20 w-5 h-5 flex items-center justify-center text-green-700">
                    <Check size={13} />{" "}
                  </div>
                  <div className="rounded-full border border-red-700 bg-red-700/20 w-5 h-5 flex items-center justify-center text-red-700">
                    <X size={13} />{" "}
                  </div>
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Emeka Okechukwu</TableCell>
              <TableCell>Okechukwu Agro Ventures</TableCell>
              <TableCell>Startup</TableCell>
              <TableCell>emeka.okechukwu@email.com</TableCell>
              <TableCell>doc</TableCell>
              <TableCell>
                <CircularProgress percentage={70} />
              </TableCell>
              <TableCell>
                {" "}
                <div className="flex gap-3">
                  <div className="rounded-full border border-green-700 bg-green-700/20 w-5 h-5 flex items-center justify-center text-green-700">
                    <Check size={13} />{" "}
                  </div>
                  <div className="rounded-full border border-red-700 bg-red-700/20 w-5 h-5 flex items-center justify-center text-red-700">
                    <X size={13} />{" "}
                  </div>
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Emeka Okechukwu</TableCell>
              <TableCell>Okechukwu Agro Ventures</TableCell>
              <TableCell>Startup</TableCell>
              <TableCell>emeka.okechukwu@email.com</TableCell>
              <TableCell>doc</TableCell>
              <TableCell>
                <CircularProgress percentage={70} />
              </TableCell>
              <TableCell>
                {" "}
                <div className="flex gap-3">
                  <div className="rounded-full border border-green-700 bg-green-700/20 w-5 h-5 flex items-center justify-center text-green-700">
                    <Check size={13} />{" "}
                  </div>
                  <div className="rounded-full border border-red-700 bg-red-700/20 w-5 h-5 flex items-center justify-center text-red-700">
                    <X size={13} />{" "}
                  </div>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
