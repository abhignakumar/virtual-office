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
import { LogInSchema } from "@repo/lib/zodTypes";
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
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { postLogIn } from "@/lib/requests";
import { NavBar } from "../NavBar";

export const LogInPage = () => {
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: postLogIn,
    onSuccess: (data) => {
      toast.success("Logged In");
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    },
    onError: (error) => {
      toast.error("Something went wrong");
      console.log(error);
    },
  });

  const form = useForm<z.infer<typeof LogInSchema>>({
    resolver: zodResolver(LogInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof LogInSchema>) {
    mutation.mutate(values);
  }

  return (
    <div>
      <NavBar />
      <div className="bg-slate-100 min-h-screen flex flex-col items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Log In</CardTitle>
            <CardDescription>
              Login or click sign up to create an account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-3"
              >
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
                <Button className="w-full" type="submit">
                  LogIn
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="text-sm text-slate-500 gap-x-1">
            <div>Don't have an account?</div>
            <Link to={"/signup"} className="underline text-blue-500">
              Sign up
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
