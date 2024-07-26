import SuperAdmin from "../model/superAdminModel";
import bcrypt from "bcryptjs";

const createDefaultSuperAdmin = async(): Promise<void> => {
    // Load environment variables
    const {
        DEFAULT_SUPER_ADMIN_EMAIL,
        DEFAULT_SUPER_ADMIN_PASSWORD,
        DEFAULT_SUPER_ADMIN_NAME,
    } = process.env;

    const missingEnvVars: string[] = [];

    if (!DEFAULT_SUPER_ADMIN_EMAIL) missingEnvVars.push('DEFAULT_SUPER_ADMIN_EMAIL');
    if (!DEFAULT_SUPER_ADMIN_PASSWORD) missingEnvVars.push('DEFAULT_SUPER_ADMIN_PASSWORD');
    if (!DEFAULT_SUPER_ADMIN_NAME) missingEnvVars.push('DEFAULT_SUPER_ADMIN_NAME');

    if (missingEnvVars.length > 0) {
        const errorMessage = `Missing environment variables: ${missingEnvVars.join(', ')}`;
        console.error(errorMessage); // Log the missing environment variables
        throw new Error(errorMessage); // Throw an error with the missing environment variables
    }

    const exsitMails = await SuperAdmin.findOne({ email: DEFAULT_SUPER_ADMIN_EMAIL });

      if (exsitMails) {
        console.log("Default Admin already exists 👍 👨 ")
        return ;
      }
      const hashedPassword = await bcrypt.hash(DEFAULT_SUPER_ADMIN_PASSWORD, 10);

      const superAdmin = new SuperAdmin({
        email: DEFAULT_SUPER_ADMIN_EMAIL,
        password: hashedPassword,
        name: DEFAULT_SUPER_ADMIN_NAME
      });

      await superAdmin.save();
      console.log("Default admin user created 🥇 ✅ 🥇 ✅ ", )
}

export default createDefaultSuperAdmin;
