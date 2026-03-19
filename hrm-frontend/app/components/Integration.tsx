"use client";

import { Card, CardContent, Button } from "@mui/material";

export default function IntegrationCard({
  title,
  status,
  onAction,
  actionLabel,
}: any) {
  return (
    <Card className="shadow-xl rounded-2xl">
      <CardContent className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">{title}</h2>

        <p className={status ? "text-green-600" : "text-red-500"}>
          {status ? "Connected" : "Not Connected"}
        </p>

        <Button variant="contained" onClick={onAction}>
          {actionLabel}
        </Button>
      </CardContent>
    </Card>
  );
}