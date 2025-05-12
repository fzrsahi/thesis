import { NextResponse } from "next/server";

import { withAuth } from "./middlewares/withAuth";

export default withAuth(() => NextResponse.next());
