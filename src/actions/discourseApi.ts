"use server";

import { getAuthSession } from "@/libs/auth";
import User from "@/models/User";

const apiUrl = process.env.DISCOURSE_API_URL as string;

const authHeaders = new Headers();

authHeaders.append("api-key", process.env.DISCOURSE_API_KEY!);
authHeaders.append("Accept", "application/json");

export async function createADiscourseUser(
  name: string,
  email: string,
  password: string,
  username: string,
  type: string
) {
  try {
    const body = {
      name: name,
      email: email,
      password: password,
      username: username,
      active: "true",
      approved: "true",
    };

    const formData = new URLSearchParams();
    for (const [key, value] of Object.entries(body)) {
      formData.append(key, value);
    }
    formData.append("user_fields[1]", type);

    const response = await fetch(`${apiUrl}/users.json`, {
      method: "POST",
      headers: authHeaders,
      body: formData,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getDiscourseUserById(id: number) {
  try {
    const response = await fetch(`${apiUrl}/admin/users/${id}.json`, {
      method: "GET",
      headers: authHeaders,
    });
    const data = await response.json();

    return data;
  } catch (error) {
    return null;
  }
}

export async function getDiscourseUserByEmail(email: string) {
  try {
    const response = await fetch(
      `${apiUrl}/admin/users/list/active?email=${email}`,
      {
        method: "GET",
        headers: authHeaders,
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) console.log(error.message);
    return null;
  }
}

export async function discourseSearchPosts(username: string) {
  try {
    const response = await fetch(`${apiUrl}/search.json?q=@${username}`);
    const data = await response.json();
    return data.posts;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getDiscourseCategories() {
  try {
    const response = await fetch(`${apiUrl}/categories.json?`);
    const data = await response.json();
    const categories = data.category_list.categories.map((c: any) => {
      return { name: c.name, id: c.id };
    });
    return categories;
    // return data.category_list.categories;
  } catch (error) {
    console.log(error);
    return null;
  }
}

const uploadProfilePic = async (
  file: FormData,
  id: string,
  userName: string
) => {
  try {
    file.append("type", "avatar");
    file.append("synchronous", "true");
    file.append("user_id", id as string);

    const response = await fetch(`${apiUrl}/uploads.json`, {
      method: "POST",
      headers: authHeaders,
      body: file,
    });

    const imgData = await response.json();

    if (imgData.url && imgData.id) {
      file.delete("files[]");
      file.delete("synchronous");
      file.delete("user_id");
      file.delete("type");
      file.append("upload_id", imgData.id);
      file.append("type", "uploaded");

      const response = await fetch(
        `${apiUrl}/u/${userName}/preferences/avatar/pick.json`,
        {
          method: "PUT",
          headers: authHeaders,
          body: file,
        }
      );
      const data = await response.json();

      if (data && data.success === "OK") {
        return imgData.url as string;
      }
    }
  } catch (err) {
    console.log(err);
    return null;
  }
};

const updateUserName = async (formData: FormData, username: string) => {
  try {
    const response = await fetch(`${apiUrl}/u/${username}.json`, {
      method: "PUT",
      headers: authHeaders,
      body: formData,
    });
    const data = await response.json();
    // console.log(data);
    if (data.success === "OK") {
      return true;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};
const updateUserEmail = async (formData: FormData, username: string) => {
  try {
    console.log(formData);
    const response = await fetch(
      `${apiUrl}/u/${username}/preferences/email.json`,
      {
        method: "PUT",
        headers: authHeaders,
        body: formData,
      }
    );
    return true;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export async function updateUserDetails(Data: FormData) {
  try {
    const session = await getAuthSession();

    const user = await User.findById(session?.user.id).select(
      "avatar email name"
    );

    if (Data.get("file")) {
      const formData = new FormData();
      const id = Data.get("id");
      const file = Data.get("file");
      formData.append("files[]", file as File);

      const data = await uploadProfilePic(
        formData,
        session?.user.discourse_id as string,
        session?.user.name as string
      );
      if (data) {
        user.avatar = data;
      }
    }

    Data.delete("file");

    if (Data.get("name")) {
      const res = await updateUserName(Data, session?.user.name as string);
      if (res) {
        user.name = Data.get("name");
      }
    }

    Data.delete("name");

    if (Data.get("email")) {
      const res = await updateUserEmail(Data, session?.user.name as string);
      if (res) {
        user.email = Data.get("email");
      }
    }

    user.save();

    return "Successfully Updated";
  } catch (error) {
    return null;
  }
}
