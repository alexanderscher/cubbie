// types/next-auth.d.ts or any other .d.ts file within your TypeScript project scope

import "next-auth";

declare module "next-auth" {
  /**
   * This extends the User model to include the id property
   */
  interface User {
    id?: string;
  }

  /**
   * This is required if you're also extending the session's user object to include the id.
   */
  interface Session {
    user?: User & { id?: string };
  }
}
