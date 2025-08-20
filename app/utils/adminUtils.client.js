export const downloadSampleFile = () => {
    const sampleData = [
        {
            fullName: "Emma Stone",
            normalizedName: "emma_stone_los_angeles_california",
            categories: [ "CELEBRITY", "ACTOR" ],
            subcategories: [ "ACTOR" ],
            socials: [
                {
                    platform: "Instagram",
                    link: "https://instagram.com/emmastone",
                },
            ],
            location: {
                city: "Los Angeles",
                state: "California",
                country: "USA",
            },
            notableAchievements: [ "Academy Award Winner", "Golden Globe Winner" ],
            maxFollowerCount: 15000000,
            maxFollowerDisplay: "15M",
            notes: "Popular actress known for La La Land and Easy A",
        },
        {
            fullName: "The Weeknd",
            categories: [ "MUSICIAN" ],
            subcategories: [ "SINGER" ],
            socials: [
                {
                    platform: "Instagram",
                    link: "https://instagram.com/theweeknd",
                },
                {
                    platform: "Twitter",
                    link: "https://twitter.com/theweeknd",
                },
            ],
            location: {
                city: "Toronto",
                state: "Ontario",
                country: "Canada",
            },
            notableAchievements: [ "3x Grammy Winner", "Billboard Artist of the Decade" ],
            maxFollowerCount: 45000000,
            maxFollowerDisplay: "45M",
            notes: "R&B and pop superstar",
        },
    ]

    const dataStr = JSON.stringify(sampleData, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

    const exportFileDefaultName = "celebrity-sample.json"

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
}