import discourse_sso from "discourse-sso";
import { NextResponse } from "next/server";
const secret = process.env.DISCOURSE_SSO_SECRET;

const sso = new discourse_sso("_qYR_u;F84&~9)-");

type body = {
  payload: string;
  sig: string;
};

export async function POST(request: Request) {
  const body: body = await request.json();
  const { payload, sig } = body;

  if (sso.validate(payload, sig)) {
    const nonce = sso.getNonce(payload);

    const userParams = {
      // Required, will throw exception otherwise
      nonce: nonce,
      external_id: "some user id here",
      email: "some user email",
      // Optional
      username: "some username",
      name: "some real name",
    };
    const q = sso.buildLoginString(userParams);
    return NextResponse.redirect(
      "http://discourse.example.com/session/sso_login?" + q
    );
  }
}
