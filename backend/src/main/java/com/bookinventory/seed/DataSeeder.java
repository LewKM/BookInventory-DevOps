package com.bookinventory.seed;

import com.github.javafaker.Faker;
import com.bookinventory.model.Book;
import com.bookinventory.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private BookRepository bookRepository;

    private final Faker faker = new Faker();

    @Override
    public void run(String... args) throws Exception {
        // Check if books already exist in the database
        if (bookRepository.count() == 0) {
            // Seed the database with fake data if no books exist
            for (int i = 0; i < 10; i++) {
                Book book = new Book();
                book.setTitle(faker.book().title());
                book.setAuthor(faker.book().author());
                book.setGenre(faker.book().genre());
                book.setPublicationYear(faker.number().numberBetween(1900, 2025));

                // Save to the database
                bookRepository.save(book);
            }

            System.out.println("Seeded 10 fake books into the database.");
        } else {
            System.out.println("Books already exist in the database. Skipping seeding.");
        }
    }
}
