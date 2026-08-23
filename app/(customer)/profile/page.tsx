"use client";

import { useRef } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Camera, Loader2 } from "lucide-react";
import { useUser } from "@/lib/hooks/use-user";
import { useToast } from "@/lib/hooks/use-toast";
import { getApiErrorMessage } from "@/lib/api/error";
import { Card, CardContent, Button, FormInput, Skeleton } from "@/components/ui";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name is too long"),
  email: z.string().email("Please enter a valid email address"),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, isLoading, updateProfile, uploadAvatar } = useUser();
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    values: user ? { name: user.name, email: user.email } : undefined,
  });

  const onSubmit = (data: ProfileForm) => {
    const emailChanging = user && data.email !== user.email;
    updateProfile.mutate(data, {
      onSuccess: () => {
        toast.success("Profile updated");
        if (emailChanging) {
          toast.info(
            "Please re-verify your email",
            "Changing your email means you'll need to verify it again."
          );
        }
      },
      onError: (err) => toast.error("Couldn't update profile", getApiErrorMessage(err)),
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    uploadAvatar.mutate(formData, {
      onSuccess: () => toast.success("Profile picture updated"),
      onError: (err) => toast.error("Couldn't upload image", getApiErrorMessage(err)),
    });
    e.target.value = "";
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl space-y-4">
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile</h1>

      <Card className="mb-6">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="relative">
            <div className="relative w-20 h-20 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
              {user?.profilePicture?.url ? (
                <Image src={user.profilePicture.url} alt={user.name} fill className="object-cover" />
              ) : (
                <span className="text-xl font-semibold text-gray-400">
                  {user?.name?.[0]?.toUpperCase()}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadAvatar.isPending}
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-gray-800 disabled:opacity-50"
              aria-label="Change profile picture"
            >
              {uploadAvatar.isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Camera className="w-3.5 h-3.5" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
          <div>
            <p className="font-medium text-gray-900">{user?.name}</p>
            <p className="text-sm text-gray-500 capitalize">
              {user?.role}
              {user?.providerType ? ` · ${user.providerType}` : ""}
            </p>
            {!user?.isVerified && (
              <p className="text-xs text-amber-600 mt-1">Email not verified</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormInput label="Full name" error={errors.name?.message} {...register("name")} />
            <FormInput
              label="Email address"
              type="email"
              error={errors.email?.message}
              {...register("email")}
            />
            <Button type="submit" isLoading={updateProfile.isPending} disabled={!isDirty}>
              Save changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
