// import sql from "better-sqlite3";
// import { sql } from "@vercel/postgress";

// import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { notFound } from "next/navigation";

import { Document, MongoClient, ObjectId, WithId } from "mongodb";
import { ICompany } from "@/interfaces/forms";
import { useRouter } from "next/navigation";
// import slugify from "slugify";
// import xss from "xss";

// import fs from "node:fs";

export async function getCompany(slug: string) {
  const connectionString = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTERNAME}.kwanjke.mongodb.net/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`;
  const client = new MongoClient(connectionString);

  try {
    await client.connect();
    const database = client.db();
    const collection = database.collection("companies");

    const result: WithId<Document> | null = await collection.findOne({ _id: new ObjectId(slug) });

    const company: ICompany | null = result
      ? {
          _id: result._id,
          name: result.name,
          companyMail: result.companyMail,
          country: result.country,
          googleSheets: result.googleSheets,
          headerText: result.headerText,
          footerText: result.footerText,
          bgColor: result.bgColor,
          bgColor2: result.bgColor2,
        }
      : null;

    console.log("Company", company);

    const plainCompany = JSON.parse(JSON.stringify(company));

    return plainCompany;

    // console.log("Company", company);
  } catch (error) {
    throw error;
  } finally {
    await client.close();
  }
}

export async function getCompanies() {
  const connectionString = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTERNAME}.kwanjke.mongodb.net/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`;
  const client = new MongoClient(connectionString);

  try {
    await client.connect();
    const database = client.db();
    const collection = database.collection("companies");

    const result = await collection.find().toArray();

    return result;
  } catch (error) {
    throw error;
  } finally {
    await client.close();
  }
}

// export async function saveMeal(meal) {
//   meal.slug = slugify(meal.title, { lower: true });
//   meal.instructions = xss(meal.instructions);

//   const { url } = await put("articles/blob1.txt", "Hello Hello World!", { access: "public" });

//   console.log(url);

//   const extension = meal.image.name.split(".").pop();
//   const fileName = `${meal.slug}.${extension}`;

//   // console.log(fileName);

//   const blob = await put(fileName, meal.image, {
//     access: "public",
//   });

//   // console.log(blob);

//   // console.log(json(blob));

//   // const stream = fs.createWriteStream(`/images/${fileName}`);
//   // const bufferedImage = await meal.image.arrayBuffer();

//   // stream.write(Buffer.from(bufferedImage), (error) => {
//   //   if (error) {
//   //     throw new Error("Saving image failed!");
//   //   }
//   // });

//   meal.image = `/images/${fileName}`;

//   // db.prepare(
//   //   `
//   //   INSERT INTO meals
//   //     (title, summary, instructions, creator, creator_email, image, slug)
//   //   VALUES (@title, @summary, @instructions, @creator, @creator_email, @image, @slug)
//   // `
//   // ).run(meal);

//   /** Vercel Blog Image Upload */

//   const connectionString = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTERNAME}.wv9umia.mongodb.net/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`;
//   const client = new MongoClient(connectionString);

//   try {
//     const response = NextResponse.json(blob);

//     const newBlob = await response.json();

//     // console.log("ImageBlob", newBlob);
//     // console.log("ImageUrl", newBlob.url);

//     meal.image = newBlob.url;

//     await client.connect();
//     const database = client.db();
//     const collection = database.collection("meals");

//     const result = await collection.insertOne(meal);
//     // console.log(result);
//     return result;
//   } catch (error) {
//     // console.log(error);
//     throw error;
//   } finally {
//     await client.close();
//   }
// }

export async function saveCompany(company: ICompany) {
  console.log("Save", company);

  const connectionString = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTERNAME}.kwanjke.mongodb.net/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`;
  const client = new MongoClient(connectionString);

  try {
    await client.connect();
    const database = client.db();
    const collection = database.collection("companies");

    const existingCompany = await collection.findOne({ _id: new ObjectId(company._id) });

    const plainCompany = JSON.parse(JSON.stringify(existingCompany));

    if (plainCompany) {
      const { _id, ...updateFields } = company;
      const result = await collection.updateOne({ _id: new ObjectId(company._id) }, { $set: updateFields });
      console.log("Company updated successfully:", result.modifiedCount);
      return result;
    } else {
      const result = await collection.insertOne(company);
      console.log("New company inserted:", result.insertedId);
      return result;
    }

    // const result = await collection.insertOne(company);
    // console.log(result);
    // return result;
  } catch (error) {
    throw error;
  } finally {
    await client.close();
  }
}
