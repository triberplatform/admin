import React from 'react'
import Header from '../components/Header'
import Breadcrumb from '../components/BreadCrumb'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/Table'
import CircularProgress from '../components/CircularProgress'
import { Briefcase, Check, X } from 'lucide-react'

export default function page() {
  return (
    <div className='px-6'>
        <Header/>
        <Breadcrumb/>
         <div className="mt-10">
                <p className="font-semibold flex gap-1 items-center mb-5">
                  <Briefcase size={15}/> Fundability Test
                </p>
            <Table>
                  <TableHead>
                    <TableRow className="bg-gray-100">
                      <TableHeader>Business Name</TableHeader>
                      <TableHeader>Type</TableHeader>
                      <TableHeader>Email</TableHeader>
                      <TableHeader>Owner</TableHeader>
                      <TableHeader>Documents</TableHeader>
                      <TableHeader>Fundability Score</TableHeader>
                      <TableHeader>Actions</TableHeader>
                    </TableRow>
                  </TableHead>
        
                  <TableBody>
                    {/* You can map through your data here */}
                    <TableRow link='/fundability-tests/fundability-details' >
                      <TableCell>Okechukwu Agro Ventures</TableCell>
                      <TableCell>Startup</TableCell>
                      <TableCell>emeka.okechukwu@email.com</TableCell>
                      <TableCell>Emeka Okechukwu</TableCell>
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
                      <TableCell>Okechukwu Agro Ventures</TableCell>
                      <TableCell>Startup</TableCell>
                      <TableCell>emeka.okechukwu@email.com</TableCell>
                      <TableCell>Emeka Okechukwu</TableCell>
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
                      <TableCell>Okechukwu Agro Ventures</TableCell>
                      <TableCell>Startup</TableCell>
                      <TableCell>emeka.okechukwu@email.com</TableCell>
                      <TableCell>Emeka Okechukwu</TableCell>
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
                      <TableCell>Okechukwu Agro Ventures</TableCell>
                      <TableCell>Startup</TableCell>
                      <TableCell>emeka.okechukwu@email.com</TableCell>
                      <TableCell>Emeka Okechukwu</TableCell>
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
                      <TableCell>Okechukwu Agro Ventures</TableCell>
                      <TableCell>Startup</TableCell>
                      <TableCell>emeka.okechukwu@email.com</TableCell>
                      <TableCell>Emeka Okechukwu</TableCell>
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
  )
}
