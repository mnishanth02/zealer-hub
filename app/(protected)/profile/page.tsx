import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

import { Calendar, Edit, Globe, Mail, MapPin, Phone, Settings, Twitter, User } from "lucide-react";

import { SignoutButton } from "@/app/(auth)/components/signout-button";
import { auth } from "@/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { USER_ROLES, ZEALER_NAME } from "@/lib/constants";

const ProfilePage = async () => {
  const session = await auth();
  if (!session || !session.user) {
    redirect("/auth/sign-in"); // Redirect to sign-in page if not logged in
  }
  const isAdmin = session.user.role === USER_ROLES.ADMIN;

  const { name, image, role, email } = session.user;

  const mockUser = {
    name: "John Doe",
    email: "john@example.com",
    role: "administrator",
    location: "San Francisco, CA",
    joinDate: "2024-01-15",
    bio: "Passionate developer with 5+ years of experience in full-stack development.",
    avatar: "/avatar.jpg",
    phone: "+1 (555) 123-4567",
    website: "https://johndoe.dev",
    social: {
      twitter: "@johndoe",
      github: "johndoe",
      linkedin: "john-doe",
    },
    stats: {
      projects: 23,
      contributions: 156,
      followers: 89,
    },
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <Card className="overflow-hidden">
          {/* Header Background */}
          <div className="h-48 bg-gradient-to-r from-primary to-secondary" />

          <CardContent className="relative px-6 pb-6">
            {/* Profile Section */}
            <div className="flex flex-col items-center sm:flex-row">
              <div className="relative -mt-24">
                ¯
                <Avatar className="h-40 w-40 border-4 border-white shadow-lg dark:border-slate-900">
                  <AvatarImage src={image || ""} alt={name || "Zealer"} />
                  <AvatarFallback className="text-2xl">
                    {name &&
                      name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="mt-6 flex-1 text-center md:ml-8 md:mt-0 md:text-left">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{name || ZEALER_NAME}</h1>
                    <p className="text-lg text-slate-500 dark:text-slate-400">{email || ""}</p>
                  </div>
                  <div className="mt-4 flex justify-center gap-3 md:mt-0">
                    <Button variant="outline" className="flex items-center gap-2">
                      <Edit className="h-4 w-4" />
                      <span>Edit Profile</span>
                    </Button>
                    {isAdmin && (
                      <Link href={"/admin"} className={buttonVariants()}>
                        <Settings className="h-4 w-4" />
                        <span>Admin Panel</span>
                      </Link>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </Badge>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {mockUser.location}
                  </Badge>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Joined {new Date(mockUser.joinDate).toLocaleDateString()}
                  </Badge>
                </div>
              </div>
            </div>
            <Separator className="mt-8 border-2" />

            {/* Stats Section */}
            {/* <div className="mt-8 grid grid-cols-3 gap-4 border-y border-slate-200 py-6 text-center dark:border-slate-700">
              <div>
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{mockUser.stats.projects}</div>
                <div className="text-sm text-slate-500">Projects</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {mockUser.stats.contributions}
                </div>
                <div className="text-sm text-slate-500">Contributions</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{mockUser.stats.followers}</div>
                <div className="text-sm text-slate-500">Followers</div>
              </div>
            </div> */}

            {/* Tabs Section */}
            <Tabs defaultValue="about" className="mt-6 w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="contact">Contact & Social</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="mt-6">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Bio</h2>
                <p className="mt-2 text-slate-600 dark:text-slate-400">{mockUser.bio}</p>
                <SignoutButton />
              </TabsContent>

              <TabsContent value="contact" className="mt-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Mail className="h-5 w-5" />
                    <span>{email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Phone className="h-5 w-5" />
                    <span>{mockUser.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Globe className="h-5 w-5" />
                    <a href={mockUser.website} className="hover:text-blue-600">
                      {mockUser.website}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Twitter className="h-5 w-5" />
                    <span>{mockUser.social.twitter}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <User className="h-5 w-5" />
                    <span>{mockUser.social.github}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <User className="h-5 w-5" />
                    <span>{mockUser.social.linkedin}</span>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
