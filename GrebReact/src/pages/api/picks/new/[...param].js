import { GetWeek } from '../../../../utils/football'

export default async function handler(req, res) {
    const { param } = req.query;
    console.log(param);

    //TODO: Implement the rest of this logic
    res.status(200).json({ });
}
