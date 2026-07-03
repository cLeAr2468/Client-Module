import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import EditProfileDialog from "@/components/modals/edit-profile";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Avatar,
    AvatarImage,
    AvatarFallback,
} from "@/components/ui/avatar";

import BackgroundLayout from "@/components/layout/background-layout";
import DashboardHeader from "@/components/layout/dashboard-header";

import {
    Mail,
    MapPin,
    GraduationCap,
    User,
    School,
} from "lucide-react";

export default function ProfileDisplay() {
    const [user, setUser] = useState({
  profile: "",
  student_id: "23-SJ00404",
  firstname: "Criscel jane ",
  middlename: "N.",
  lastname: "Herrera",
  course: "BS Information Technology",
  year: "4th Year",
  email: "herracrisceljane@gmail.com",
  address: "Brgy, Quezon San Jorge samar",
  status: "Active",
});

    // Generate initials
    const initials = `${user.firstname?.charAt(0) ?? ""}${user.lastname?.charAt(0) ?? ""
        }`.toUpperCase();

    return (
        <BackgroundLayout overlayColor="bg-green-950/70">
            <DashboardHeader />

            <div className="w-full lg:p-8 p-4">

                {/*DESKTOP VIEW */}
                <div className="hidden lg:block">
                    <Card className="overflow-hidden rounded-3xl border-0 shadow-xl">
                        <div className="h-40 bg-green-950/70" />

                        <CardContent className="-mt-24">
                            <div className="flex gap-8">
                                {/* LEFT */}

                                <div className="w-72 flex flex-col items-center">
                                    <Avatar className="w-40 h-40 border-8 border-white shadow-xl">
                                        <AvatarImage
                                            src={user.profile}
                                            alt={`${user.firstname} ${user.lastname}`}
                                        />

                                        <AvatarFallback className="bg-green-700 text-white text-5xl font-bold">
                                            {initials}
                                        </AvatarFallback>
                                    </Avatar>

                                    <h2 className="mt-4 text-2xl font-bold text-center">
                                        {user.firstname} {user.middlename} {user.lastname}
                                    </h2>


                                    <Badge className="mt-3 bg-green-100 text-green-700">{user.status}</Badge>

                                    <EditProfileDialog
                                        user={user}
                                        onSave={setUser}
                                        />
                                </div>

                                {/* RIGHT */}

                                <div className="flex-1">
                                    <Card className="border-none shadow-none">
                                        <CardHeader>
                                            <CardTitle>Personal Information</CardTitle>
                                        </CardHeader>

                                        <CardContent>
                                            <div className="grid grid-cols-2 gap-6">
                                                <Info
                                                    icon={<User size={18} />}
                                                    label="Student ID"
                                                    value={user.student_id}
                                                />

                                                <Info
                                                    icon={<GraduationCap size={18} />}
                                                    label="Course"
                                                    value={user.course}
                                                />
                                                <Info
                                                    icon={<School size={18} />}
                                                    label="Year Level"
                                                    value={user.year}
                                                />
                                                <Info
                                                    icon={<Mail size={18} />}
                                                    label="Email"
                                                    value={user.email}
                                                />
                                                <Info
                                                    icon={<MapPin size={18} />}
                                                    label="Address"
                                                    value={user.address}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* MOBILE VIEW */}

                <div className="lg:hidden">
                    <Card className="overflow-hidden rounded-3xl shadow-xl">
                        <div className="h-28 bg-green-950/70" />

                        <CardContent className="-mt-16">
                            <div className="flex flex-col items-center">
                                <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                                    <AvatarImage
                                        src={user.profile}
                                        alt={`${user.firstname} ${user.middlename} ${user.lastname}`}
                                    />

                                    <AvatarFallback className="bg-green-700 text-white text-4xl font-bold w-full">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>

                                <h2 className="mt-4 text-xl font-bold text-center">
                                    {user.firstname} {user.middlename} {user.lastname}
                                </h2>

                                <Badge className="mt-3 bg-green-100 text-green-700">{user.status}</Badge>

                                    <EditProfileDialog
                                         user={user}
                                        onSave={setUser}
                                        />

                                <Separator className="my-6" />

                                <div className="space-y-5 w-full">
                                    <Info
                                        icon={<User size={18} />}
                                        label="Student ID"
                                        value={user.student_id}
                                    />

                                    <Info
                                        icon={<GraduationCap size={18} />}
                                        label="Course"
                                        value={user.course}
                                    />

                                    <Info
                                        icon={<School size={18} />}
                                        label="Year Level"
                                        value={user.year}
                                    />

                                    <Info
                                        icon={<Mail size={18} />}
                                        label="Email"
                                        value={user.email}
                                    />
                                    <Info
                                        icon={<MapPin size={18} />}
                                        label="Address"
                                        value={user.address}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </BackgroundLayout>
    );
}

function Info({ icon, label, value }) {
    return (
        <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-700">
                {icon}
            </div>

            <div>
                <p className="text-sm text-muted-foreground">{label}</p>

                <p className="font-semibold break-words">{value}</p>
            </div>
        </div>
    );
}