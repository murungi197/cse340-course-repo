DROP TABLE IF EXISTS public.project_category;
DROP TABLE IF EXISTS public.category;
DROP TABLE IF EXISTS public.project;

CREATE TABLE public.project (
    project_id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    project_date DATE NOT NULL,
    organization_id INTEGER NOT NULL,
    CONSTRAINT project_organization_fk
        FOREIGN KEY (organization_id)
        REFERENCES public.organization (organization_id)
        ON DELETE CASCADE
);

INSERT INTO public.project (title, description, project_date, organization_id) VALUES
    ('Read with a student', 'Support elementary readers during a weekly literacy session.', '2026-09-14', 1),
    ('Build classroom shelves', 'Assemble and install storage for a community learning room.', '2026-09-22', 1),
    ('Prepare science kits', 'Organize hands-on science materials for after-school learners.', '2026-10-01', 1),
    ('Coach a study group', 'Help students practice math and prepare for upcoming exams.', '2026-10-08', 1),
    ('Paint a learning space', 'Refresh the walls and work areas of a neighborhood classroom.', '2026-10-17', 1),
    ('Harvest the community garden', 'Gather fresh produce for neighborhood food boxes.', '2026-09-17', 2),
    ('Sort donated seeds', 'Prepare seed packets and supplies for the next growing season.', '2026-09-24', 2),
    ('Build raised garden beds', 'Construct accessible planting beds for a shared garden.', '2026-10-03', 2),
    ('Pack a fresh food delivery', 'Assemble produce boxes for local families and seniors.', '2026-10-10', 2),
    ('Mulch the orchard paths', 'Spread mulch and clear paths around the community orchard.', '2026-10-19', 2),
    ('Refresh a shared space', 'Give a neighborhood park some care before the new season.', '2026-09-19', 3),
    ('Assemble welcome kits', 'Prepare practical supplies for neighbors moving into new homes.', '2026-09-26', 3),
    ('Repair community benches', 'Sand, repair, and repaint benches in a busy public plaza.', '2026-10-05', 3),
    ('Host a neighborhood cleanup', 'Collect litter and sort recyclable materials from local streets.', '2026-10-12', 3),
    ('Organize a winter drive', 'Sort coats, blankets, and household goods for distribution.', '2026-10-21', 3),
    ('Read with a student', 'Support elementary readers during a weekly literacy session.', '2026-09-16', 4),
    ('Build classroom shelves', 'Assemble and install storage for a community learning room.', '2026-09-23', 4),
    ('Prepare science kits', 'Organize hands-on science materials for after-school learners.', '2026-10-02', 4),
    ('Coach a study group', 'Help students practice math and prepare for upcoming exams.', '2026-10-09', 4),
    ('Paint a learning space', 'Refresh the walls and work areas of a neighborhood classroom.', '2026-10-18', 4),
    ('Harvest the community garden', 'Gather fresh produce for neighborhood food boxes.', '2026-09-18', 5),
    ('Sort donated seeds', 'Prepare seed packets and supplies for the next growing season.', '2026-09-25', 5),
    ('Build raised garden beds', 'Construct accessible planting beds for a shared garden.', '2026-10-04', 5),
    ('Pack a fresh food delivery', 'Assemble produce boxes for local families and seniors.', '2026-10-11', 5),
    ('Mulch the orchard paths', 'Spread mulch and clear paths around the community orchard.', '2026-10-20', 5),
    ('Refresh a shared space', 'Give a neighborhood park some care before the new season.', '2026-09-20', 6),
    ('Assemble welcome kits', 'Prepare practical supplies for neighbors moving into new homes.', '2026-09-27', 6),
    ('Repair community benches', 'Sand, repair, and repaint benches in a busy public plaza.', '2026-10-06', 6),
    ('Host a neighborhood cleanup', 'Collect litter and sort recyclable materials from local streets.', '2026-10-13', 6),
    ('Organize a winter drive', 'Sort coats, blankets, and household goods for distribution.', '2026-10-22', 6);

CREATE TABLE public.category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE public.project_category (
    project_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    PRIMARY KEY (project_id, category_id),
    CONSTRAINT project_category_project_fk
        FOREIGN KEY (project_id)
        REFERENCES public.project (project_id)
        ON DELETE CASCADE,
    CONSTRAINT project_category_category_fk
        FOREIGN KEY (category_id)
        REFERENCES public.category (category_id)
        ON DELETE CASCADE
);

INSERT INTO public.category (name) VALUES
    ('Education'),
    ('Food Access'),
    ('Community Improvement'),
    ('Neighborhood Support');

INSERT INTO public.project_category (project_id, category_id)
SELECT project.project_id, category.category_id
FROM public.project
INNER JOIN public.category
    ON category.name = CASE
        WHEN project.title IN ('Read with a student', 'Build classroom shelves', 'Prepare science kits', 'Coach a study group', 'Paint a learning space')
            THEN 'Education'
        WHEN project.title IN ('Harvest the community garden', 'Sort donated seeds', 'Build raised garden beds', 'Pack a fresh food delivery', 'Mulch the orchard paths')
            THEN 'Food Access'
        WHEN project.title IN ('Refresh a shared space', 'Repair community benches', 'Host a neighborhood cleanup')
            THEN 'Community Improvement'
        ELSE 'Neighborhood Support'
    END;

SELECT project_id, project_date, title, organization_id
FROM public.project
ORDER BY project_date, project_id;
