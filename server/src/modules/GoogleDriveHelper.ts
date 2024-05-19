import { drive_v3 } from "googleapis";

const { google } = require('googleapis');


export class GoogleDriveHelper {
  private clientId: String;
  private clientSecret: String;
  private redirectUri: String;
  private scopes: Array<String>;
  private oAuth2Client: any;
  private accessToken: string | undefined;
  private refreshToken: string | undefined;
  private driveFolder: string | undefined;

  private static instance: GoogleDriveHelper | null;

  private constructor() {
    if (!process.env.GOOGLE_API_CLIENT_ID || !process.env.GOOGLE_API_CLIENT_SECRET || !process.env.GOOGLE_API_REDIRECT_URI) {
      console.error("GOOGLE API CREDENTIALS NOT FOUND EXITING");
      process.exit(1);
    }
    this.clientId = process.env.GOOGLE_API_CLIENT_ID;
    this.clientSecret = process.env.GOOGLE_API_CLIENT_SECRET;
    this.redirectUri = process.env.GOOGLE_API_REDIRECT_URI;
    this.scopes = ['https://www.googleapis.com/auth/drive'];

    this.oAuth2Client = new google.auth.OAuth2(this.clientId, this.clientSecret, this.redirectUri);

    this.accessToken = process.env.GOOGLE_API_ACCESS_TOKEN;
    this.refreshToken = process.env.GOOGLE_API_REFRESH_TOKEN;

    if (!this.accessToken || !this.refreshToken) {
      console.log("Access token and/or refresh token not known - log in to Google to fix this")
    } else {
      this.oAuth2Client.setCredentials({ refresh_token: this.refreshToken, access_token: this.accessToken });
    }

    this.driveFolder = process.env.GOOGLE_API_DRIVE_FOLDER_ID;
  }

  public static getInstance() {
    if (!GoogleDriveHelper.instance) {
      GoogleDriveHelper.instance = new GoogleDriveHelper();
    }
    return GoogleDriveHelper.instance;
  }

  public generateAuthUrl() : string {
    const authUrl = this.oAuth2Client.generateAuthUrl({
      // 'online' (default) or 'offline' (gets refresh_token)
      access_type: 'offline',
      /** Pass in the scopes array defined above.
      * Alternatively, if only one scope is needed, you can pass a scope URL as a string */
      scope: this.scopes,
      // Enable incremental authorization. Recommended as a best practice.
      include_granted_scopes: true
    });
    return authUrl;
  }

  public async exchangeCodeForTokens(code: string) {
    // Exchange the authorization code for access and refresh tokens
    const { tokens } = await this.oAuth2Client.getToken(code);
    this.accessToken = tokens.access_token;
    this.refreshToken = tokens.refresh_token;
    this.oAuth2Client.setCredentials({ refresh_token: this.refreshToken, access_token: this.accessToken });

    // TODO: Save the tokens in a database or session for future use - for now - just copy to ENV file
    console.log(`accessToken: \n${this.accessToken} \nrefreshToken: \n${this.refreshToken}`);
  }

  public listFiles () {
    try {
      var drive = google.drive({
        version: "v3",
        auth: this.oAuth2Client,
      });

      const listParams: drive_v3.Params$Resource$Files$List = {
        q: this.driveFolder ? `'${this.driveFolder}' in parents` : undefined,
        pageSize: 10,
        fields: 'files(name, id)',
      };

      drive.files.list(listParams).then( (response : any) => {
        console.log(response.data.files);
      }
      );
      //const files = response.data.files;
      
    } catch (err) {
      console.error('Error listing files:', err);
    }
  }

  public async getFileId(name: string) : Promise<string | null> {
    try {
      var drive = google.drive({
        version: "v3",
        auth: this.oAuth2Client,
      });

      let querry : string = `name = '${name}'`
      if (this.driveFolder) {
        querry = querry + `and '${this.driveFolder}' in parents`
      }

      const listParams: drive_v3.Params$Resource$Files$List = {
        q: querry,
        pageSize: 1,
        fields: 'files(id)',
      };

      const response = await drive.files.list(listParams);
      if (response.data.files && response.data.files.length > 0)
      {
        return response.data.files[0].id as string;
      }
    } catch (err) {
      console.error('Error listing files:', err);
    }
    return null;
  }

  public async putFile(contents : string, fileName : string) {
    try {
      var drive = google.drive({
        version: "v3",
        auth: this.oAuth2Client,
      });

      const fileMetadata = {
        name: fileName,
        parents: [this.driveFolder],
      };
      const media = {
        mimeType: 'application/octet-stream',
        body: contents,
      };

      const file = await drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id',
      });
      console.log('File Id:', file.data.id);
      return file.data.id;
    } catch (err) {
      console.error('Error uploading file:', err);
    }
    return null;
  }
};