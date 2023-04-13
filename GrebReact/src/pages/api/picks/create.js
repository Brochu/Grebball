import { FindPoolerByEmail, InsertNewPicks } from '../../../lib/database';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).send({ message: 'Only send post request to the endpoint' });
        return;
    }

    let picks = {};
    const matchids = JSON.parse(req.body['matchids']);
    for (let i in matchids) {
        picks[matchids[i]] = req.body[matchids[i]];
    }
    const pooler = await FindPoolerByEmail(req.body['pooler-email']);

    const pickObj = {
        'season': Number(req.body['season']),
        'week': Number(req.body['week']),
        //#TODO: Get the player id from the logged in pooler map
        'pooler_id': pooler['_id'],
        'pickstring': JSON.stringify(picks),
    }

    // Insert new picks in the database
    InsertNewPicks(pickObj)

    res.status(200).json({
        'success': true,
        'errorcode': 0,
    });
}
