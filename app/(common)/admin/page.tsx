import Link from "next/link";
import { redirect } from "next/navigation";

import { ArrowLeft } from "lucide-react";

import { auth } from "@/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {  buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { findAllUsers } from "@/data-access/auth.queries";
import { USER_ROLES } from "@/lib/constants";
import { cn } from "@/lib/utils";

import { ChangeUserRoleInput } from "../components/change-user-role";
import ToggleEmailVerify from "../components/toggle-email-verified";

export default async function AdminPage() {
  const session = await auth();

  if (session?.user?.role !== USER_ROLES.ADMIN) redirect("/profile");

  const users = await findAllUsers();


  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center">
          <Link
            href="/profile"
            className={cn(
              "flex items-center gap-2 bg-gradient-to-r from-primary to-secondary",
              buttonVariants({ variant: "outline" })
            )}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Profile
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Email Verified</TableHead>
                  <TableHead>Join Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.image || ""} alt={user.name || ""} />
                          <AvatarFallback>
                            {user.name &&
                              user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-slate-500">India</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <ChangeUserRoleInput currentRole={user.role} email={user.email} isAdmin={user.role === "ADMIN"} />
                    </TableCell>
                    <TableCell>
                      <ToggleEmailVerify
                        email={user.email}
                        emailVerified={user.emailVerified}
                        isAdmin={user.role === "ADMIN"}
                      />
                    </TableCell>
                    <TableCell>
                      {/* TODO hardcoded date */}
                      {new Date().toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
