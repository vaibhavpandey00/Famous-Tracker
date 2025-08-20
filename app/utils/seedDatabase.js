import { celebsToUpload } from "../../temp/celebs"

export const uploadCelebsToDB = async (prisma) => {
    console.log(`Starting upload of ${celebsToUpload.length} celeb records...`);
    for (const celebData of celebsToUpload) {
        try {
            // Create a mutable copy to avoid modifying the original array element if reused
            const dataForPrisma = { ...celebData };

            // Calculate maxFollower and format it
            // const rawMaxFollower = calculateMaxFollower(dataForPrisma.socials);
            // dataForPrisma.maxFollower = formatFollowerCount(rawMaxFollower);

            const newCeleb = await prisma.GlobalCelebrity.create({
                data: dataForPrisma,
            });
            console.log(`Successfully uploaded celeb: ${newCeleb.fullName} (ID: ${newCeleb.id})`);
        } catch (error) {
            // Handle unique constraint errors (e.g., duplicate email) specifically if needed
            if (error.code === 'P2002') {
                console.warn(`Skipping duplicate celeb (email: ${celebData.email}): ${error.message}`);
            } else {
                console.error(`Failed to upload celeb ${celebData.fullName}:`, error);
            }
        }
    }
    console.log("Finished uploading celeb records.");
}