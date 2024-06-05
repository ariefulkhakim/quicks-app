import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { WebhookEvent } from "@clerk/nextjs/dist/types/server";
import { Webhook } from "svix";
import { internal } from "./_generated/api";
const validatePayload = async (
  req: Request
): Promise<WebhookEvent | undefined> => {
  const payload = await req.text();

  const svixHeaders = {
    "svix-id": req.headers.get("svix-id")!,
    "svix-timestamp": req.headers.get("svix-timestamp")!,
    "svix-signature": req.headers.get("svix-signature")!,
  };

  const webhook = new Webhook(
    process.env.CLERK_WEBHOOK_SECRET || "whsec_Ox0XZuHUsFdDQ6E+nsTnMJbifAymJoXk"
  );

  try {
    const event = webhook.verify(payload, svixHeaders) as WebhookEvent;

    return event;
  } catch (error) {
    console.log("Clerk webhook request colud not be verified.");
    return;
  }
};

const handleClerkWebhook = httpAction(async (ctx, req) => {
  const event = await validatePayload(req);

  if (!event) {
    return new Response("Could not validate Clerk payload", {
      status: 400,
    });
  }

  switch (event.type) {
    case "user.created":
      let user = await ctx.runQuery(internal.user.get, {
        id: event.data.id,
      });

      if (user) {
        console.log(`Updating user ${event.data.id} with: ${event.data}`);
      } else {
        await ctx.runMutation(internal.user.create, {
          username: event.data.username!,
          imageurl: event.data.image_url,
          userId: event.data.id,
          email: event.data.email_addresses[0].email_address,
        });
      }

      break;

    case "user.updated":
      {
        await ctx.runMutation(internal.user.create, {
          username: event.data.username!,
          imageurl: event.data.image_url,
          userId: event.data.id,
          email: event.data.email_addresses[0].email_address,
        });
      }

      break;

    default: {
      console.log("Clerk webhook event not supported");
    }
  }

  return new Response(null, {
    status: 200,
  });
});

const http = httpRouter();

http.route({
  path: "/clerk-users-webhook",
  method: "POST",
  handler: handleClerkWebhook,
});

export default http;
