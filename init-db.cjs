const fs = require('fs');
const path = require('path');
const prompts = require('prompts');

/**
 * @typedef {{id:string,name:string,color:string|null,created_at:number}} Project
 * @typedef {{id:string,projectId:string,title:string,created_at:number}} Task
 */

/**
 *
 * @param  {{project:{name:string,color?:string},tasks:string[]}[]} [dummyData]
 * @returns {{projects:Project[],tasks:Task[], timelogs:[]}}
 */
const createOutput = (dummyData) => {
    const output = {
        projects: [],
        tasks: [],
        timelogs: [],
    };
    if (!Array.isArray(dummyData)) return output;
    dummyData
        .filter(
            (entry) =>
                entry instanceof Object && entry.project instanceof Object
        )
        .forEach(({ project: { name, color }, tasks }) => {
            if (!name) return;
            const projectId = output.projects.length + 1;
            output.projects.push({
                name,
                color: color || null,
                id: projectId,
            });
            if (!Array.isArray(tasks)) return;
            tasks.forEach((title) => {
                if (!title) return;
                output.tasks.push({
                    projectId,
                    title,
                    id: output.tasks.length + 1,
                });
            });
        });
    output.tasks.sort((a, b) => a.start - b.start);
    return output;
};

(async () => {
    try {
        const skipPrompts = process.argv.slice(2)[0] === '-y';
        const dbPath = path.resolve(__dirname, 'db.json');
        if (skipPrompts) {
            await fs.promises.writeFile(
                dbPath,
                JSON.stringify(createOutput(), undefined, 4),
                'utf-8'
            );
            console.log('initialized empty db.json');
            return;
        }
        const onCancel = () => {
            throw new Error('✖ Operation cancelled');
        };
        const dbExists = fs.existsSync(dbPath);
        const { dummyData } = await prompts(
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
                {
                    type: 'toggle',
                    name: 'dummyData',
                    message: 'Initialize db.json with dummy data?',
                    initial: false,
                    active: 'yes',
                    inactive: 'no',
                },
            ],
            {
                onCancel,
            }
        );
        const output = createOutput(
            !dummyData
                ? null
                : [
                      {
                          project: { name: 'Kunskapskontroll' },
                          tasks: [
                              'Läsa instruktioner',
                              'Fixa db.json',
                              'Göra alla api-funktioner',
                              'Fixa frontend',
                              'Laborum dolor Lorem excepteur est non consequat nostrud Lorem ex reprehenderit. Nostrud ad reprehenderit velit cupidatat. In id ullamco labore eu occaecat non.',
                          ],
                      },
                  ]
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
