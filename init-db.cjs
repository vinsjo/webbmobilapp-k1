const fs = require('fs');
const path = require('path');
const prompts = require('prompts');

const output = {
    projects: [],
    tasks: [],
    timelogs: [],
};

(async () => {
    try {
        const skipPrompts = process.argv.slice(2)[0] === '-y';
        const dbPath = path.resolve(__dirname, 'db.json');
        if (skipPrompts) {
            await fs.promises.writeFile(
                dbPath,
                JSON.stringify(output, undefined, 4),
                'utf-8'
            );
            console.log('initialized empty db.json');
            return;
        }
        const onCancel = () => {
            throw new Error('✖ Operation cancelled');
        };
        const dbExists = fs.existsSync(dbPath);

        await prompts(
            [
                {
                    type: !dbExists ? null : 'toggle',
                    name: 'overwrite',
                    message: 'db.json already exists, overwrite it?',
                    initial: false,
                    active: 'yes',
                    inactive: 'no',
                },
                {
                    type: (_, { overwrite }) => {
                        if (overwrite === false) onCancel();
                        return null;
                    },
                },
            ],
            {
                onCancel,
            }
        );

        await fs.promises.writeFile(
            dbPath,
            JSON.stringify(output, undefined, 4),
            'utf-8'
        );
    } catch (err) {
        console.log(err instanceof Error ? err.message : err);
    }
})();
