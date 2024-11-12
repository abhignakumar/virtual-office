import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { SignUpSchema } from "@repo/lib/zodTypes";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Link, useNavigate } from "react-router-dom";
import { AvatarsList } from "./AvatarsList";
import { useMutation } from "@tanstack/react-query";
import { postSignUp } from "@/lib/requests";
import { toast } from "sonner";

export const SignUpPage = () => {
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: postSignUp,
    onSuccess: () => {
      toast.success("Signed Up");
      navigate("/");
    },
    onError: (error) => {
      toast.error("Something went wrong");
      console.log(error);
    },
  });

  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      avatarId: "",
    },
  });

  function onSubmit(values: z.infer<typeof SignUpSchema>) {
    mutation.mutate(values);
  }

  return (
    <div className="bg-slate-100 min-h-screen flex flex-col items-center justify-center">
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>
            Create a new account to use the application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter email address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <AvatarsList form={form} />
              <Button className="w-full" type="submit">
                Sign Up
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="text-sm text-slate-500 gap-x-1">
          <div>Already have an account?</div>
          <Link to={"/login"} className="underline text-blue-500">
            Log In
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};
