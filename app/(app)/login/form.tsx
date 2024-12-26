"use client";

import { login } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState } from "react";
import { LoaderIcon } from "lucide-react";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <form action={action} className="grid w-full max-w-[350px] px-4">
      <Card className="w-full max-w-[350px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          {state?.message && <CardDescription>{state.message}</CardDescription>}

          {(state?.errors?.email || state?.errors?.password) && (
            <CardDescription>
              {state?.errors?.password && (
                <div className="text-sm text-red-800">
                  <p>Password must:</p>
                  <ul>
                    {state.errors.password.map((error) => (
                      <li key={error}>- {error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {state?.errors?.email && (
                <p className="text-sm text-red-800">{state.errors.email}</p>
              )}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">
                Email <span className="text-red-600">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                placeholder="user@example.com"
                type="email"
                required
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">
                Password <span className="text-red-600">*</span>
              </Label>
              <Input id="password" name="password" type="password" required />
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Button className="w-full" disabled={pending} type="submit">
            {pending && (
              <span>
                <LoaderIcon className="animate-spin" />{" "}
              </span>
            )}
            Login
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
