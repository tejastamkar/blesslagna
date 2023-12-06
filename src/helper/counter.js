module.exports = {

    getNextCounter: async (
        collection,
        column
    ) => {
        const _counter = await collection.aggregate([
            { $project: { [column]: 1, _id: 0 } },
            { $sort: { [column]: -1 } },
            { $limit: 1 }
        ]);
        return _counter.length > 0 ? _counter[0][column] == undefined ? 1 : _counter[0][column] + 1 : 1;
    }

}
